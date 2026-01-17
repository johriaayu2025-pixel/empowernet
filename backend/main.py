import hashlib
import json
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from ml.text_infer import analyze_text
from ml.image_infer import analyze_image_base64
from ml.audio_infer import analyze_audio
from ml.video_infer import analyze_video_base64
from ml.video_plus_infer import analyze_video_base64_plus
from hedera.service import hedera_service

import os

app = FastAPI()

# Railway/Production CORS handling
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

# Add custom frontend URL if provided via environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("ENV") != "production" else allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_scan_hash(result: dict) -> str:
    """Creates a deterministic SHA-256 hash of the critical forensic data."""
    # We only hash the immutable forensic parts
    core_data = {
        "category": result.get("category"),
        "riskScore": result.get("riskScore"),
        "confidence": result.get("confidence"),
        "explanation": result.get("explanation", [])[:3] # Hash first 3 points
    }
    # Normalize JSON dump for consistency
    normalized = json.dumps(core_data, sort_keys=True, separators=(",", ":"))
    
    # Return hex hash
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

@app.post("/api/scan")
def scan(payload: dict):
    try:
        scan_type = payload.get("type")
        content = payload.get("content")

        result = {}
        if scan_type == "text":
            result = analyze_text(content)
        elif scan_type == "image":
            result = analyze_image_base64(content)
        elif scan_type == "audio":
            result = analyze_audio(content)
        elif scan_type == "video":
            result = analyze_video_base64_plus(content)
        else:
            return {"error": "Unsupported scan type"}

        if "error" in result:
             return result

        # 🔐 Hedera HCS Anchoring Logic
        evidence_hash = generate_scan_hash(result)
        result["evidenceHash"] = evidence_hash
        
        # MANDATORY DEBUG LOG
        print("EVIDENCE HASH GENERATED :", evidence_hash)
        
        if hedera_service.enabled:
            # Anchor to Hedera Consensus Service
            hedera_proof = hedera_service.anchor_evidence({
                "target": content[:100], # Preview of content
                "evidenceHash": evidence_hash,
                "label": result.get("category", "Uncategorized")
            })
            
            if hedera_proof:
                result["ledger"] = {
                    "network": "Hedera Testnet",
                    "type": "Consensus Service (HCS)",
                    "transactionId": hedera_proof["transactionId"],
                    "topicId": hedera_proof["topicId"],
                    "consensusTimestamp": hedera_proof["consensusTimestamp"],
                    "explorerUrl": hedera_proof["explorerUrl"],
                    "status": "confirmed"
                }
            else:
                result["ledger"] = {"status": "failed", "error": "HCS Submission Failed"}
        else:
            result["ledger"] = {
                "network": "Digital Registry",
                "status": "offline",
                "reason": "Hedera Service unconfigured"
            }

        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

@app.post("/api/verify")
def verify_evidence(payload: dict):
    """
    Verifies if a hash exists on the Hedera Ledger.
    """
    evidence_hash = payload.get("evidenceHash")
    if not evidence_hash:
        return {"error": "evidenceHash required"}

    return hedera_service.verify_evidence(evidence_hash)
