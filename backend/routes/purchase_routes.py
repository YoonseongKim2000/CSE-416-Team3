from fastapi import APIRouter, Body, HTTPException, status, Request, Response, Depends
from core.api_key_gen import generateKey
from db.db_interface import UserInModel, UserOutModel, get_user_by_email, update_tokens, update_isPaid
from pymongo.errors import PyMongoError
from typing import Annotated
from routes.access_routes import verify_token

router = APIRouter(prefix="/purchase", tags=["purchase"])

# TODO:MONTHLY SUBSCRIPTION
@router.post(
    "/monthly",
    status_code=status.HTTP_202_ACCEPTED,
)
async def buy_monthly(authuser: Annotated[UserOutModel, Depends(verify_token)], request: Request):

    db = request.app.database
    user_email = authuser["email"]

    #checks
    result = await get_user_by_email(UserInModel(email=user_email), db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=400, detail="Credential error")

    if (result["isPaid"]):
        raise HTTPException(status_code=418, detail="Already Monthly Member")

    update_result = await update_isPaid(user_email, db, True)

    if (isinstance(update_result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")
    
    return

@router.post(
    "/50",
    status_code=status.HTTP_202_ACCEPTED
)
async def buy_50_tokens(authuser: Annotated[UserOutModel, Depends(verify_token)], request: Request):

    db = request.app.database
    user_email = authuser["email"]

    #checks
    result = await get_user_by_email(UserInModel(email=user_email), db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=400, detail="Credential error")
    
    result["tokens"] = result["tokens"] + 50

    update_result = await update_tokens(user_email, db, result["tokens"])

    if (isinstance(update_result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")
    
    return

@router.post(
    "/100",
    status_code=status.HTTP_202_ACCEPTED
)
async def buy_100_tokens(authuser: Annotated[UserOutModel, Depends(verify_token)], request: Request):

    db = request.app.database
    user_email = authuser["email"]

    #checks
    result = await get_user_by_email(UserInModel(email=user_email), db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=400, detail="Credential error")
    
    result["tokens"] = result["tokens"] + 100
    
    update_result = await update_tokens(user_email, db, result["tokens"])

    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")
    
    return update_result

@router.post(
    "/200",
    status_code=status.HTTP_202_ACCEPTED
)
async def buy_200_tokens(authuser: Annotated[UserOutModel, Depends(verify_token)], request: Request):

    db = request.app.database
    user_email = authuser["email"]

    #checks
    result = await get_user_by_email(UserInModel(email=user_email), db)
    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")

    if (result == None):
        raise HTTPException(status_code=400, detail="Credential error")
    
    result["tokens"] = result["tokens"] + 200
    
    update_result = await update_tokens(user_email, db, result["tokens"])

    if (isinstance(result, PyMongoError)):
        raise HTTPException(status_code=500, detail="Database error")
    
    return update_result

