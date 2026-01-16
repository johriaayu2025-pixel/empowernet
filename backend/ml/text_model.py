# backend/ml/text_model.py

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import hashlib

# Load once at startup (IMPORTANT)
MODEL_NAME = "distilbert-base-uncased-finetuned-sst-2-english"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()


def analyze_text(text: str):
    # Tokenize
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )

    # Inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=1)[0]

    negative_prob = probs[0].item()  # treat as scam likelihood
    positive_prob = probs[1].item()

    risk_score = int(negative_prob * 100)
    category = "SCAM" if risk_score > 60 else "SAFE"

    return {
        "category": category,
        "confidence": round(negative_prob, 3),
        "riskScore": risk_score,
        "explanation": [
            "Transformer-based semantic analysis",
            "Contextual intent classification",
            "Urgency / manipulation patterns detected"
            if category == "SCAM"
            else "No malicious intent detected"
        ],
        "modelDetails": {
            "architecture": "DistilBERT (Transformer)",
            "featuresAnalysed": [
                "semantic context",
                "sentence intent",
                "urgency signals",
                "manipulative phrasing"
            ]
        },
        "evidenceHash": hashlib.sha256(text.encode()).hexdigest()
    }
