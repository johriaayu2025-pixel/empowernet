from facenet_pytorch import MTCNN
from PIL import Image
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"

mtcnn = MTCNN(
    image_size=224,
    margin=20,
    keep_all=False,
    device=device
)

def extract_face(image: Image.Image):
    face = mtcnn(image)
    return face
