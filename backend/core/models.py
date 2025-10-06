import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
from .config import CONFIG

def five_crop_transform(crops):
    return torch.stack([
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])(
            transforms.ToTensor()(c)) for c in crops
    ])

# Model init
model_gen = models.resnet18(weights=None)
in_features = model_gen.fc.in_features
model_gen.fc = torch.nn.Linear(in_features, CONFIG["num_classes"])
model_gen.load_state_dict(torch.load("model_gen.pth", map_location=torch.device("cpu")))
model_gen.eval()

transform = transforms.Compose([
    transforms.Resize(672),
    transforms.FiveCrop(224),  # returns 5 cropped images
    transforms.Lambda(five_crop_transform)  # stack into tensor of shape (5, 3, 224, 224)
])

# Prediction function
def predict_image(image_file):
    """Run prediction with 5-crop averaging"""
    img = Image.open(image_file).convert("RGB")
    crops_tensor = transform(img).unsqueeze(0)  # (1, 5, 3, 224, 224)

    bs, ncrops, c, h, w = crops_tensor.size()
    crops_tensor = crops_tensor.view(-1, c, h, w)  # (5, 3, 224, 224)

    with torch.no_grad():
        outputs = model_gen(crops_tensor)  # (5, num_classes)
        outputs = outputs.view(bs, ncrops, -1).mean(1)  # average over crops

        probs = F.softmax(outputs, dim=-1)
        idx = torch.argmax(probs, dim=-1).item()
        confidence = probs[0, idx].item()

    return {
        "class": CONFIG["class_names"][idx],
        "confidence": round(confidence, 4)
    }
