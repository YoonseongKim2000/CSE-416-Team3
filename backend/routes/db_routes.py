from fastapi import APIRouter
from db.atlas_client import AtlasClient

router = APIRouter(prefix="/db", tags=["Database"])

client = AtlasClient()

@router.post("/ping")
def ping():
    client.ping()
    return {"message": "ping'd"}

@router.get("/getUsers")
def get_users():
    users = client.get_users()
    return users
