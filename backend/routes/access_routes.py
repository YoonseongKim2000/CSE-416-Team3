from fastapi import APIRouter, HTTPException, status, Request
from db.db_interface import UserInModel, UserOutModel
from pymongo.errors import PyMongoError
import jwt
from jwt.exceptions import InvalidTokenError
from dotenv import load_dotenv
from pydantic import EmailStr
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/access", tags=["User Access"])
load_dotenv()
SECRET_KEY = os.getenv('SECRET-KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MIN = 60

refresh_tokens = []

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
    access_token_exp = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN)
    access_token = generate_token(data={"sub": email}, expires_delta=access_token_exp)
    refresh_token = generate_token(data={"sub": email})

    refresh_tokens.append(refresh_tokens)

    return (access_token, refresh_token)



