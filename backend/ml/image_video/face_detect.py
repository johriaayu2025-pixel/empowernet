import cv2
import numpy as np
from PIL import Image
from facenet_pytorch import MTCNN

# Load once
mtcnn = MTCNN(keep_all=True, device="cpu")

def extract_faces(image: np.ndarray):
    """
    image: BGR (OpenCV)
    returns: list of face PIL images
    """
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)

    boxes, _ = mtcnn.detect(pil_img)

    faces = []
    if boxes is not None:
        for box in boxes:
            x1, y1, x2, y2 = map(int, box)
            face = pil_img.crop((x1, y1, x2, y2))
            faces.append(face)

    return faces
