from fastapi import APIRouter
from core.api_key_gen import generateKey

router = APIRouter(prefix="/account", tags=["AccountDetails"])

@router.post("/signup")
def createUser(email: str):
    apiKey = generateKey(email)

    #TODO: Database glorp