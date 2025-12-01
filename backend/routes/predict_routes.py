from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Request
from core.models import predict_image
from db.db_interface import decr_token, get_user_by_apikey
from pymongo.errors import PyMongoError

router = APIRouter(prefix="/api", tags=["AI Model"])

# REQUEST_FRONTEND = "https://yoonseongkim2000.github.io"
REQUEST_FRONTEND = "http://localhost:5173"

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
    request: Request,
    model: str = Form(...),
    image: UploadFile = File(...),
    apiKey: str = "NONE"
):
    try:
        if (apiKey == "NONE"):
            raise HTTPException(status_code=400, detail="API Key Missing")
        
        db = request.app.database

        check_result = await get_user_by_apikey(apiKey, db)
        if (isinstance(check_result, PyMongoError)):
            raise HTTPException(status_code=500, detail="Database error")
        if (check_result == None):
            raise HTTPException(status_code=400, detail="API Key Not Found")
        #NOTE: check_result is an obj of UserOutModel class 
        if (check_result.tokens <= 0):
            raise HTTPException(status_code=400, detail="Not Enough Tokens")
        result = predict_image(image.file, model)
        await decr_token(apiKey, db)
        return result
    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

