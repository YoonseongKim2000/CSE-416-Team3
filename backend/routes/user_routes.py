from fastapi import APIRouter, Body, HTTPException, status, Request, Response
from core.api_key_gen import generateKey
from db.db_interface import UserInModel, UserOutModel, get_user_by_email, create_user, get_user_login
from pymongo.errors import PyMongoError
from routes.access_routes import generate_tokens

router = APIRouter(prefix="/user", tags=["Users"])

@router.post(
        "/signup",
        response_model=UserOutModel,
        status_code=status.HTTP_201_CREATED,
        response_model_by_alias=False
)
async def sign_up(user: UserInModel, request: Request):

    db = request.app.database

    #check that password field isnt null
    if (user.password == None):
        raise HTTPException(status_code=400, detail="Required credentials missing")

    #check if email already exists
    result = await get_user_by_email(user, db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result != None):
        raise HTTPException(status_code=400, detail="Credential error")

    #generate missing values
    user.isPaid = False
    user.tokens = 0
    user.APIKey = generateKey(user.email)

    new_usr = await create_user(user, db)
    if (isinstance(new_usr, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    return new_usr.model_dump(by_alias=False, exclude=["id"])

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

    if (result[0] != user.password):
        raise HTTPException(status_code=403, detail="Cannot log in: Incorrect email or password")

    tokens = generate_tokens(user.email)

    response.set_cookie(key="jwt", value=tokens[1], httponly=True, secure=True)
    return {"accessToken": tokens[0], "email": user.email} 
