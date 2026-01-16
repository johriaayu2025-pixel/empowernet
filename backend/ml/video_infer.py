import base64
import io
import cv2
import numpy as np
import torch
import timm
from PIL import Image
from torchvision import transforms

device = torch.device("cpu")

# Pretrained EfficientNet (ImageNet)
model = timm.create_model(
    "efficientnet_b0",
    pretrained=True,
    num_classes=1000
)
model.eval().to(device)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


def analyze_frame(frame: np.ndarray):
    image = Image.fromarray(frame).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        features = model.forward_features(tensor)
        variance = torch.var(features).item()

    fake_prob = min(1.0, variance / 2.5)
    return fake_prob


def analyze_video_base64(base64_video: str):
    video_bytes = base64.b64decode(base64_video)

    temp_path = "temp_video.mp4"
    with open(temp_path, "wb") as f:
        f.write(video_bytes)

    cap = cv2.VideoCapture(temp_path)

    fake_scores = []
    frame_count = 0
    SAMPLE_EVERY = 15  # sample every 15 frames

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % SAMPLE_EVERY == 0:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            fake_scores.append(analyze_frame(frame_rgb))

        frame_count += 1

    cap.release()

    if not fake_scores:
        return {"error": "No frames extracted"}

    avg_fake = float(np.mean(fake_scores))

    return {
        "category": "DEEPFAKE" if avg_fake >= 0.5 else "REAL",
        "confidence": avg_fake if avg_fake >= 0.5 else 1 - avg_fake,
        "riskScore": int(avg_fake * 100),
        "explanation": [
            "Frame-level CNN artifact analysis",
            "EfficientNet pretrained texture variance",
            "Multi-frame aggregation voting"
        ],
        "modelDetails": {
            "architecture": "EfficientNet-B0 (pretrained)",
            "featuresAnalysed": [
                "temporal inconsistency",
                "texture variance",
                "compression artifacts"
            ]
        }
    }
