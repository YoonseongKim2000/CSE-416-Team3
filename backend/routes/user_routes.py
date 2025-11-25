from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, status, Request, Response
from routes.access_routes import verify_token
from core.api_key_gen import generateKey
from db.db_interface import UpdateUserModel, UserInModel, UserOutModel, get_user_by_email, create_user, UserAccessAuthOut, update_password, update_isPaid, update_APIKey, delete_user_db
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

    if (len(user.email) > 72 or len(user.password) > 72):
        raise HTTPException(status_code=413, detail="Content too large")

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

@router.put(
    "/password",
    status_code=status.HTTP_200_OK,
)
async def change_pw(authuser: Annotated[UserOutModel, Depends(verify_token)], userin: UpdateUserModel, request: Request):
    db = request.app.database

    if (userin.password == None):
        raise HTTPException(status_code=400, detail="Required credentials missing")

    #check that the use found through access token and user given by API call are the same
    if (authuser["email"] != userin.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflicting credentials in request")

    #checking user exists handled by verify_token

    #check if current password matches given current password
    curruser = await get_user_by_email(userin, db)
    if (curruser["password"] != userin.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password")

    result = await update_password(userin, db)

    if (isinstance(result, PyMongoError) or result == 0):
        raise HTTPException(status_code=500, detail="Database error")

    return result

@router.post(
    "/cancelPlan",
    status_code=status.HTTP_202_ACCEPTED         
)
async def cancel_plan(authuser: Annotated[UserOutModel, Depends(verify_token)], request: Request):

    db = request.app.database
    user_email = authuser["email"]

      #checks
    result = await get_user_by_email(UserInModel(email=user_email), db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=400, detail="Credential error")

    if (not result["isPaid"]):
        raise HTTPException(status_code=418, detail="Already Monthly Member")

    update_result = await update_isPaid(user_email, db, False)

    if (isinstance(update_result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")
    
    return

@router.get(
    "/info", 
    status_code=status.HTTP_200_OK
)
async def info(authuser: Annotated[UserOutModel, Depends(verify_token)], request: Request):
    db = request.app.database
    user_email = authuser["email"]

    #checks
    result = await get_user_by_email(UserInModel(email=user_email), db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=400, detail="Credential error")
    
    return {"tier" : result["isPaid"], "tokenRemaining": result["tokens"], "apiKey": result["APIKey"]}

@router.put(
    "/regenKey",
    status_code=status.HTTP_202_ACCEPTED
)
async def regen_key (authuser: Annotated[UserOutModel, Depends(verify_token)], request: Request):
    db = request.app.database
    user_email = authuser["email"]

    #checks
    result = await get_user_by_email(UserInModel(email=user_email), db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=400, detail="Credential error")
    
    newKey = generateKey(user_email)

    update_result = await update_APIKey(user_email, db, newKey)

    if (isinstance(update_result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")
    
    return

@router.delete(
    "/delete",
    status_code=status.HTTP_200_OK
)
async def delete_user(authuser: Annotated[UserOutModel, Depends(verify_token)], userin: UserInModel, request: Request):
    db = request.app.database
    
    if (authuser["password"] == None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Required credentials missing")

    result = await delete_user_db(userin, db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Credential error")

    if (result != 1):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error")

    return result
    
    