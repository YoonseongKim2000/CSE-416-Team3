# routes/minigame_routes.py
from fastapi import APIRouter, HTTPException, Query, Form
from fastapi.responses import FileResponse
import os, random, uuid
from core.models import predict_image
from io import BytesIO

router = APIRouter(prefix="/api/minigame", tags=["MiniGame"])

# Full path to your dataset
DATA_ROOT = "D:/datasets"

# Temporary round storage (simple dict)
ROUND_STORE = {}

@router.get("/start")
async def start_round(model: str = Query(..., regex="^(anime|art|general)$")):
    """
    Randomly select an image from:
    D:/datasets/<model>/(train|test)/(AI|Human)
    """
    model_path = os.path.join(DATA_ROOT, model)

    choices = []

    # Collect folder paths for train/test
    for split in ["train", "test"]:
        ai_path = os.path.join(model_path, split, "AI")
        human_path = os.path.join(model_path, split, "Human")

        if os.path.isdir(ai_path):
            ai_images = [os.path.join(ai_path, f) for f in os.listdir(ai_path)]
            choices.extend([(p, 0) for p in ai_images])

        if os.path.isdir(human_path):
            human_images = [os.path.join(human_path, f) for f in os.listdir(human_path)]
            choices.extend([(p, 1) for p in human_images])

    if not choices:
        raise HTTPException(500, "Dataset is empty or path incorrect.")

    # Randomly choose an image + truth label
    selected_path, truth = random.choice(choices)

    round_id = str(uuid.uuid4())
    print(round_id)
    ROUND_STORE[round_id] = {
        "model": model,
        "path": selected_path,
        "truth": truth
    }

    return {
        "roundId": round_id,
        "imageUrl": f"api/minigame/image?roundId={round_id}"
    }

@router.get("/image")
async def get_round_image(roundId: str):
    if roundId not in ROUND_STORE:
        raise HTTPException(400, "Invalid round ID")

    path = ROUND_STORE[roundId]["path"]
    return FileResponse(path)

@router.post("/guess")
async def evaluate_round(
    roundId: str = Form(...),
    guess: int = Form(...)
):
    if roundId not in ROUND_STORE:
        raise HTTPException(400, "Invalid round ID")

    record = ROUND_STORE[roundId]
    model = record["model"]
    truth = record["truth"]
    path = record["path"]

    # Load image from disk
    with open(path, "rb") as f:
        image_bytes = f.read()

    # Model prediction
    buffer = BytesIO(image_bytes)
    result = predict_image(buffer, model.capitalize())

    ai_prediction = result["predicted_class"]

    return {
        "truth": truth,                 # 0=AI, 1=Human
        "humanCorrect": guess == truth,
        "aiCorrect": ai_prediction == truth,
        "aiPrediction": ai_prediction,
        "confidence": result["confidence"],
        "original_image": result["original_image"],
        "attention_heatmap": result["attention_heatmap"],
        "masked_overlay": result["masked_overlay"]
    }
