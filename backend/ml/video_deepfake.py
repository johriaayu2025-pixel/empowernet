import cv2
import base64
import tempfile
import os
from ml.image_deepfake import analyze_image_base64

def analyze_video_base64(base64_str: str):
    video_bytes = base64.b64decode(base64_str)

    # save temp video
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as f:
        f.write(video_bytes)
        video_path = f.name

    cap = cv2.VideoCapture(video_path)

    frame_scores = []
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # sample every 30th frame (~1 fps)
        if frame_count % 30 == 0:
            _, buffer = cv2.imencode(".jpg", frame)
            img_b64 = base64.b64encode(buffer).decode()

            result = analyze_image_base64(img_b64)
            frame_scores.append(result["riskScore"])

        frame_count += 1

    cap.release()
    os.remove(video_path)

    if not frame_scores:
        return {"error": "No frames extracted"}

    avg_score = sum(frame_scores) / len(frame_scores)
    category = "DEEPFAKE" if avg_score > 50 else "REAL"

    return {
        "category": category,
        "confidence": avg_score / 100,
        "riskScore": int(avg_score),
        "explanation": [
            "Frame-wise deepfake detection",
            "Majority voting across frames",
            "Image-based transformer model"
        ],
        "modelDetails": {
            "method": "Frame sampling + image voting",
            "framesAnalyzed": len(frame_scores)
        }
    }
