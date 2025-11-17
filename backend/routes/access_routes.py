from fastapi import APIRouter, HTTPException, status, Request, Response, Depends
from db.db_interface import UserInModel, UserOutModel, get_user_by_email
from pymongo.errors import PyMongoError
import jwt
from jwt.exceptions import InvalidTokenError
from dotenv import load_dotenv
from pydantic import EmailStr
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
import os

router = APIRouter(prefix="/access", tags=["User Access"])
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MIN = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

refresh_tokens = []

async def verify_token(token: Annotated[str, Depends(oauth2_scheme)], request: Request, response: Response):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    
    db = request.app.database
    usermodel = UserInModel.model_validate({'email': email})
    user = await get_user_by_email(usermodel, db)

    if (isinstance(user, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if user is None:
        raise credentials_exception
    
    return (user, request, response)

def generate_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else: 
        expire = datetime.now(timezone.utc) + timedelta(days=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_tokens(email: EmailStr):
    #access_token_exp = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN)
    access_token_exp = timedelta(days=ACCESS_TOKEN_EXPIRE_MIN)
    access_token = generate_token(data={"sub": email}, expires_delta=access_token_exp)
    refresh_token = generate_token(data={"sub": email})

    refresh_tokens.append(refresh_tokens)

    return (access_token, refresh_token)

@router.post(
    "/login",
    status_code=status.HTTP_200_OK
)    
async def log_in(user: UserInModel, request: Request, response: Response):
    db = request.app.database

    #check that password field isnt null
    if (user.password == None):
        raise HTTPException(status_code=400, detail="Required credentials missing")

    #get user login details
    result = await get_user_login(user, db)
    print(result)
    print("userIn: " + user.email + " " + user.password)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=403, detail="Cannot log in: Incorrect email or password")

    if (result[1] != user.password):
        raise HTTPException(status_code=403, detail="Cannot log in: Incorrect email or password")

    tokens = generate_tokens(user.email)

    response.set_cookie(
        key="jwt", 
        value=tokens[1], 
        httponly=True, 
        secure=True, 
        samesite='None'
    )

    cookie_header = response.headers.get("set-cookie")
    response.headers["set-cookie"] = cookie_header + "; Partitioned"
    
    return {"accessToken": tokens[0], "email": user.email} 



