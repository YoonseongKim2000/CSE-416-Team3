from fastapi import APIRouter, Body, HTTPException, status, Request
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing import Optional, List
from typing_extensions import Annotated
from bson import ObjectId
from pymongo import ReturnDocument
import asyncio
# from server import database
from core.api_key_gen import generateKey

router = APIRouter(prefix="/db", tags=["Database"])
# user_collection = database.get_collextion("users")


#Used to convert BSON _id values to JSON-friendly strings
PyObjectID = Annotated[str, BeforeValidator(str)]

class UserInModel(BaseModel):
    """
    Container for a single user record sent to backend
    """
    id: Optional[PyObjectID] = Field(alias="_id", default=None)
    email: EmailStr = Field(...)
    password: str = Field(...)
    isPaid: bool = Field(...)
    tokens: int = Field(...)
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
    # email: EmailStr = Field(...)
    # isPaid: bool = Field(...)
    # tokens: int = Field(...)
    # APIKey: str = Field(...)
    email: EmailStr = Field(...)
    isPaid: Optional[bool] = False
    tokens: Optional[int] = 0
    APIKey: Optional[str] = None
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

@router.post(
    "/user", 
    response_model=UserOutModel, 
    status_code=status.HTTP_201_CREATED, # CHANGED
    response_model_by_alias=False # CHANGED
)
async def create_user(user: UserInModel, request: Request):
    
    db = request.app.database
    user_collection = db.get_collection("users")

    new_user = user.model_dump(by_alias=True, exclude=["id"])
    new_user["isPaid"] = False
    new_user["tokens"] = 0
    new_user["APIKey"] = generateKey(new_user["email"])
    result = await user_collection.insert_one(new_user)
    new_user["_id"] = result.inserted_id

    return new_user

@router.get("/users", response_model=UserCollection, response_model_by_alias=False,)
async def list_users(request: Request):
    """
    List all user data in the database
    """
    db = request.app.database
    user_collection = db.get_collection("users")
    return UserCollection(users=await user_collection.find().to_list())