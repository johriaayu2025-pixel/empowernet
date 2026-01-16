import re

# Strong scam indicators
SCAM_PATTERNS = [
    r"urgent",
    r"act now",
    r"limited time",
    r"verify your account",
    r"click here",
    r"http[s]?://",
    r"free money",
    r"winner",
    r"congratulations",
    r"gift card",
    r"otp",
    r"bank account",
    r"password",
    r"crypto",
    r"wallet",
    r"pay immediately"
]

def apply_risk_boosters(text: str) -> float:
    """
    Returns a risk boost between 0.0 and 0.4
    """
    text = text.lower()
    boost = 0.0

    for pattern in SCAM_PATTERNS:
        if re.search(pattern, text):
            boost += 0.05

    # Cap boost (VERY IMPORTANT)
    return min(boost, 0.4)
