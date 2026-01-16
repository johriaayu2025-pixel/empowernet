import base64
import tempfile
import cv2
import numpy as np
from .face_detect import extract_faces
from .image_model import predict_image
from .video_model import analyze_video

def analyze_image_base64(b64):
    img_bytes = base64.b64decode(b64)
    img_array = np.frombuffer(img_bytes, np.uint8)
    image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    faces = extract_faces(image)
    scores = [predict_image(face) for face in faces]

    return max(scores) if scores else 0.0


def analyze_video_base64(b64):
    with tempfile.NamedTemporaryFile(suffix=".mp4") as f:
        f.write(base64.b64decode(b64))
        f.flush()
        return analyze_video(f.name)
