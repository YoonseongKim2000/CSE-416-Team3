from fastapi import APIRouter, File, UploadFile
from core.models import predict_image

router = APIRouter(prefix="/api", tags=["AI Model"])

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    return predict_image(file.file)
