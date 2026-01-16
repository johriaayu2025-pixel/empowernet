from pydantic import BaseModel
from typing import Optional

class ScanRequest(BaseModel):
    type: str          # text | image | audio | video
    content: str       # text or base64
    label: Optional[str] = "Unknown Source"

class ScanResult(BaseModel):
    id: str
    type: str
    label: str
    status: str        # safe | suspicious | fraudulent | deepfake
    confidence: str
    hash: str
    date: str
    tag: str
