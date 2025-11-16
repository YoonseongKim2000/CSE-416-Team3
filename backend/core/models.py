import torch
import torch.nn.functional as F
from transformers import ViTConfig, ViTForImageClassification
from torchvision import transforms
from PIL import Image
from pathlib import Path
import numpy as np
import cv2
import base64
from io import BytesIO

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Model weights
MODEL_PATHS = {
    "general": Path("vit_general.pth"),
    "art": Path("vit_art.pth"),
    "anime": Path("vit_anime.pth"),
}

MODEL_NAME = "google/vit-base-patch16-224-in21k"
NUM_CLASSES = 2

# Load Models
models = {}
for key, path in MODEL_PATHS.items():
    config = ViTConfig.from_pretrained(MODEL_NAME, output_attentions=True, attn_implementation="eager")
    config.num_labels = NUM_CLASSES
    model = ViTForImageClassification(config)
    model.load_state_dict(torch.load(path, map_location=device))
    model.to(device)
    model.eval()
    models[key] = model

print("All models loaded successfully!")

# Image preprocessing
normalize = transforms.Normalize(mean=[0.5]*3, std=[0.5]*3)
to_tensor = transforms.ToTensor()

def nine_crop(image: Image.Image, crop_size=224):
    w, h = image.size
    crops = []
    for i in range(0, w, crop_size):
        for j in range(0, h, crop_size):
            crops.append(image.crop((j, i, j + crop_size, i + crop_size)))
    return crops

def preprocess_image(file_bytes: bytes):
    image = Image.open(file_bytes).convert("RGB")
    orig_w, orig_h = image.size
    image = image.resize((224*3, 224*3))
    crops = nine_crop(image)
    processed = torch.stack([normalize(to_tensor(c)) for c in crops])
    processed = processed.unsqueeze(0).to(device)
    return processed, image, (orig_w, orig_h)

def attention_rollout(attentions):
    """Compute attention rollout (flattened)"""
    att_mat = [att[0].mean(0).cpu().numpy() for att in attentions]
    aug_att = [att + np.eye(att.shape[0]) for att in att_mat]
    aug_att = [att / att.sum(axis=-1, keepdims=True) for att in aug_att]
    rollout = aug_att[0]
    for mat in aug_att[1:]:
        rollout = mat @ rollout
    rollout_map = rollout[0, 1:]
    return rollout_map.reshape(14, 14)

def tensor_to_base64(img: np.ndarray, fmt="PNG"):
    """Convert numpy image to base64"""
    pil_img = Image.fromarray((img*255).astype(np.uint8))
    buffered = BytesIO()
    pil_img.save(buffered, format=fmt)
    return base64.b64encode(buffered.getvalue()).decode()

# Prediction function
def predict_image(file_bytes: bytes, model_key: str = "general"):
    processed, resized_img, orig_size = preprocess_image(file_bytes)
    model = models[model_key]

    with torch.no_grad():
        bs, ncrops, c, h, w = processed.size()
        inputs = processed.view(-1, c, h, w)
        outputs = model(pixel_values=inputs)
        logits = outputs.logits
        attentions = outputs.attentions

        logits = logits.view(bs, ncrops, -1).mean(1)
        probs = F.softmax(logits, dim=1)
        conf, pred = torch.max(probs, 1)
        confidence = float(conf.item())
        predicted_class = int(pred.item())

    # Attention Map Processing
    attn_maps = []
    for i in range(ncrops):
        attn_map = attention_rollout([att[i].unsqueeze(0) for att in attentions])
        attn_maps.append(attn_map)

    combined_attn = np.zeros((14*3, 14*3))
    for idx, attn_map in enumerate(attn_maps):
        i, j = divmod(idx, 3)
        combined_attn[i*14:(i+1)*14, j*14:(j+1)*14] = attn_map

    combined_attn = cv2.GaussianBlur(combined_attn, (5,5), sigmaX=3)
    combined_attn = (combined_attn - combined_attn.min()) / (combined_attn.max() - combined_attn.min())
    attn_up = cv2.resize(combined_attn, (224*3,224*3), interpolation=cv2.INTER_CUBIC)
    attn_up = cv2.GaussianBlur(attn_up, (21,21), sigmaX=5)
    attn_full = cv2.resize(attn_up, orig_size, interpolation=cv2.INTER_CUBIC)

    # Generate overlay images
    orig_img_np = np.array(Image.open(file_bytes).convert("RGB")).astype(np.float32) / 255.0

    # 1. Proper CAM-style heatmap
    attn_color = cv2.applyColorMap(np.uint8(255 * attn_full), cv2.COLORMAP_JET)
    attn_color = cv2.cvtColor(attn_color, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0

    # Make sure both arrays are the same type
    overlay_intensity = 0.5
    cam_overlay = cv2.addWeighted(
        orig_img_np.astype(np.float32),
        1 - overlay_intensity,
        attn_color.astype(np.float32),
        overlay_intensity,
        0
    )

    # 2. Less dark masked overlay
    fade_mask = np.clip((attn_full - 0.15) / 0.85, 0.2, 1)[..., None].astype(np.float32)
    masked_overlay = orig_img_np * fade_mask

    # Convert all to base64
    orig_b64 = tensor_to_base64(orig_img_np)
    overlay_b64 = tensor_to_base64(cam_overlay)
    masked_b64 = tensor_to_base64(masked_overlay)

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "original_image": orig_b64,
        "attention_heatmap": overlay_b64,
        "masked_overlay": masked_b64
    }

