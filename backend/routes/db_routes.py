from fastapi import APIRouter
from db.atlas_client import AtlasClient

router = APIRouter(prefix="/db", tags=["Database"])
