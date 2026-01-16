import torch
import timm
import torchvision.transforms as T

# Load model ONCE
model = timm.create_model(
    "efficientnet_b0",
    pretrained=False,
    num_classes=2
)

model.load_state_dict(torch.load("ml/models/efficientnet.pth", map_location="cpu"))
model.eval()

transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.5]*3, std=[0.5]*3)
])

def predict_image(face_img):
    img = transform(face_img).unsqueeze(0)

    with torch.no_grad():
        logits = model(img)
        probs = torch.softmax(logits, dim=1)

    return probs[0][1].item()  # fake probability
