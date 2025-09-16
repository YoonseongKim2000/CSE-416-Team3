# server.py
import torch
import torch.nn.functional as F
from torchvision import models, transforms
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from db import AtlasClient

app = FastAPI()
# =================================================================
# PUT ALL DB SHIT HERE FOR NOW
# =================================================================
client = AtlasClient()

@app.post("/db/ping")
def ping():
    client.ping()
    return {"message": "ping'd"}

@app.get("/db/getUsers")
def getUsers():
    users = client.get_users()
    return users


config = {
    "image_size": 224,
    "num_classes": 2,
    "class_names": ["AI", "Human"]
}

# =================================================================

# =================================================================
# AI GLORP HERE
# =================================================================

# load model without weights
model = models.resnet18(weights=None)
in_features = model.fc.in_features
model.fc = torch.nn.Linear(in_features, config["num_classes"])

# load weights, make sure it is saved in root (./backend)
model.load_state_dict(torch.load(
    "resnetweights.pth", 
    map_location=torch.device("cpu")
))
model.eval()

transform = transforms.Compose([
    transforms.Resize((config["image_size"], config["image_size"])),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5]*3, std=[0.5]*3),
])

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")
    img_tensor = transform(img).unsqueeze(0)  # (1, 3, 224, 224)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = F.softmax(outputs, dim=-1)
        idx = torch.argmax(probs, dim=-1).item()
        confidence = probs[0, idx].item()

    return {
        "class": config["class_names"][idx],
        "confidence": round(confidence, 4)
    }

# =================================================================
