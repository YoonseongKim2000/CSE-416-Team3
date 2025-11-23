from fastapi import APIRouter, Body, HTTPException, Response, status, Request
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing import Optional, List
from typing_extensions import Annotated
from bson import ObjectId
from pymongo import ReturnDocument 
from pymongo.errors import PyMongoError
import asyncio
# from server import database
from core.api_key_gen import generateKey

#Used to convert BSON _id values to JSON-friendly strings
PyObjectID = Annotated[str, BeforeValidator(str)]

class UserInModel(BaseModel):
    """
    Container for a single user record sent to backend
    """
    id: Optional[PyObjectID] = Field(alias="_id", default=None)
    email: EmailStr = Field(...)
    password: Optional[str] = None
    isPaid: Optional[bool] = False
    tokens: Optional[int] = 0
    APIKey: Optional[str] = None
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "email": "test@test.com",
                "password": "test",
                "isPaid": "false",
                "tokens": 0,
            }
        },
    )

class UserOutModel(BaseModel):
    """
    Container for a single user record recieved from backend
    """
    id: Optional[PyObjectID] = Field(alias="_id", default=None)
    email: EmailStr = Field(...)
    isPaid: bool = Field(...)
    tokens: int = Field(...)
    APIKey: str = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "email": "test@test",
                "isPaid": "false",
                "tokens": 0,
                "APIKey": "string"
            }
        },
    )

class UpdateUserModel(BaseModel):
    password: Optional[str] = None
    isPaid: Optional[bool] = None
    token: Optional[int] = None
    APIKey: Optional[str] = None
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

class UserCollection(BaseModel):
    """
    A container holding a list of UserModel instances
    """
    users: List[UserOutModel]

class UserAccessAuthOut(BaseModel):
    userin: Optional[UserInModel] = None
    authuser: UserOutModel = Field(...)
    request: Request = Field(...)
    response: Response = Field(...)
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
    )

async def get_user_by_email(user: UserInModel, db):
    user_collection = db.get_collection("users")
    try:
        result = await user_collection.find_one({"email" : user.email})
        print(result)
        print(type(result))
    except PyMongoError as e: #NOTE: MUST check that db function result is not of type PyMongoError
        result = e
    return result

async def create_user(user: UserInModel, db):
    
    user_collection = db.get_collection("users")

    new_user = user.model_dump(by_alias=True, exclude=["id"])
    try:
        result = await user_collection.insert_one(new_user)
        new_user["_id"] = result.inserted_id
        outval = UserOutModel.model_validate(new_user)
    except PyMongoError as e:
        outval = e

    return outval

async def get_user_login(user: UserInModel, db):
    user_collection = db.get_collection("users")
    try:
        result = await user_collection.find_one({"email": user.email})
        outval = (result["email"], result["password"])
    except PyMongoError as e:
        outval = e
    
    return outval

async def update_password(user: UserInModel, db):
    user_collection = db.get_collection("users")

    try:
        result = await user_collection.update_one({"$and": [ {'email': user.email}, {'password': user.password} ]}, {'$set': {'password': user.password}})
        outval = result.modified_count
    except PyMongoError as e:
        outval = e

    return outval

# @router.get("/users", response_model=UserCollection, response_model_by_alias=False,)
# async def list_users(request: Request):
#     """
#     List all user data in the database
#     """
#     db = request.app.database
#     user_collection = db.get_collection("users")
#     return UserCollection(users=await user_collection.find().to_list())