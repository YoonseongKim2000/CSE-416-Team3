from fastapi import APIRouter, File, UploadFile, Form
from core.models import predict_image

router = APIRouter(prefix="/api", tags=["AI Model"])

@router.post("/analyze")
async def analyze_image(
    model: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        result = predict_image(image.file, model)
        return result
    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

