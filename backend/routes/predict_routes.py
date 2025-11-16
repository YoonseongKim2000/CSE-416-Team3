from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Request
from core.models import predict_image

router = APIRouter(prefix="/api", tags=["AI Model"])

REQUEST_FRONTEND = "https://yoonseongkim2000.github.io"

@router.post("/analyze")
async def analyze_image(
    request: Request,
    model: str = Form(...),
    image: UploadFile = File(...)
):
    
    try:
        origin = request.headers.get("origin")
        if origin != REQUEST_FRONTEND:
            raise HTTPException(status_code=403, detail="Forbidden origin")
        result = predict_image(image.file, model)
        return result
    except HTTPException:
        raise  # let FastAPI send the proper status code
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/APIanalyze")
async def analyze_image(
    model: str = Form(...),
    image: UploadFile = File(...),
    apiKey: str = "NONE"
):
    try:
        if (apiKey == "NONE"):
            raise HTTPException(status_code=400, detail="API Key Missing")
        elif (apiKey == "NONE"): #TODO: Implement database look up here
            raise HTTPException(status_code=400, detail="API Key Not Found")
        # TODO: Check Token amount
        result = predict_image(image.file, model)
        # TODO: decrement one token from account here
        return result
    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

