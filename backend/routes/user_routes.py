from fastapi import APIRouter, Body, HTTPException, status, Request, Response
from core.api_key_gen import generateKey
from db.db_interface import UserInModel, UserOutModel, get_user_by_email, create_user 
from pymongo.errors import PyMongoError

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

