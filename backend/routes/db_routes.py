from fastapi import APIRouter, Body, HTTPException, status, Request
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing import Optional, List
from typing_extensions import Annotated
from bson import ObjectId
from pymongo import ReturnDocument
import asyncio

router = APIRouter(prefix="/db", tags=["Database"])

#Used to convert BSON _id values to JSON-friendly strings
PyObjectID = Annotated[str, BeforeValidator(str)]

class UserModel(BaseModel):
    """
    Container for a single user record
    """
    id: Optional[PyObjectID] = Field(alias="_id", default=None)
    username: str = Field(...)
    pw: str = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "username": "test",
                "pw": "test",
            }
        },
    )

class UserCollection(BaseModel):
    """
    A container holding a list of UserModel instances
    """
    users: List[UserModel]

@router.get("/users", response_model=UserCollection, response_model_by_alias=False,)
async def list_users(request: Request):
    """
    List all user data in the database
    """
    user_collection = request.app.database.get_collection("users")
    return UserCollection(users=await user_collection.find().to_list())