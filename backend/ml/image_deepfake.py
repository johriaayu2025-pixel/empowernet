from transformers import pipeline
import base64
import io
from PIL import Image

# Load ONCE (safe & public)
image_detector = pipeline(
    "image-classification",
    model="prithivMLmods/deepfake-detector-model-v1"
)

def analyze_image_base64(base64_str: str):
    image_bytes = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    result = image_detector(image)[0]

    label = result["label"].lower()
    score = result["score"]

    category = "DEEPFAKE" if "fake" in label else "REAL"

    return {
        "category": category,
        "confidence": score,
        "riskScore": int(score * 100),
        "explanation": [
            "Vision transformer deepfake classifier",
            "Face manipulation artifact detection",
            "Pretrained on deepfake datasets"
        ],
        "modelDetails": {
            "architecture": "SigLIP2 (Image Transformer)",
            "source": "prithivMLmods/deepfake-detector-model-v1"
        }
    }
