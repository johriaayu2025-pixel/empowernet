from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Dummy trained model (for now)
vectorizer = TfidfVectorizer()
classifier = LogisticRegression()

# Train on tiny sample (replace later with real dataset)
X = [
    "win a free iphone now",
    "urgent account suspended",
    "hello how are you",
    "let's meet tomorrow"
]
y = [1, 1, 0, 0]

X_vec = vectorizer.fit_transform(X)
classifier.fit(X_vec, y)

def analyze_text(text: str):
    vec = vectorizer.transform([text])
    pred = classifier.predict(vec)[0]
    prob = classifier.predict_proba(vec)[0].max()

    return {
        "category": "Scam" if pred == 1 else "Safe",
        "confidence": float(prob),
        "riskScore": int(prob * 100),
        "explanation": ["TF-IDF keyword pattern match"],
        "modelDetails": {
            "architecture": "TF-IDF + Logistic Regression",
            "featuresAnalysed": ["ngrams", "keywords"]
        },
        "evidenceHash": "text-hash-demo"
    }
