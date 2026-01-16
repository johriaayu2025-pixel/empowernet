import base64
import io
import torch
import librosa
import numpy as np
import scipy.stats
from ml.explain import build_audio_summary

# No huge model needed for this signal processing approach
# We look for "flatness" in high frequencies common in cheap TTS/VC models

def analyze_audio(base64_audio: str):
    try:
        audio_bytes = base64.b64decode(base64_audio)
        audio_buffer = io.BytesIO(audio_bytes)

        # Load audio (mono)
        y, sr = librosa.load(audio_buffer, sr=16000)

        if len(y) < 16000:
            return {"error": "Audio too short for analysis (min 1 sec)"}

    except Exception as e:
        return {"error": "Invalid audio input"}

    features_list = []

    # ==========================================
    # 1. Advanced Spectral Feature Extraction
    # ==========================================
    
    # A. MFCCs & Delta-MFCCs (Timbre Dynamics)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    mfcc_var = np.var(mfcc, axis=1).mean()
    
    # Delta (Rate of change of timbre) - AI is often "smoother"
    mfcc_delta = librosa.feature.delta(mfcc)
    delta_var = np.var(mfcc_delta, axis=1).mean()

    # B. Spectral Rolloff (High frequency cutoff common in Vocoders)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr, roll_percent=0.85)
    rolloff_mean = np.mean(rolloff)

    # C. Spectral Flatness (Buzziness / Synthetic Noise)
    flatness = librosa.feature.spectral_flatness(y=y)
    flatness_mean = np.mean(flatness)

    # D. Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y)
    zcr_var = np.var(zcr)

    # ==========================================
    # 2. Heuristic Detection Logic
    # ==========================================
    
    score = 0.0
    
    # RULE 1: Oversmoothed Timbre (Low Delta Variance)
    # Real speech has high frame-to-frame variance. AI is often interpolated.
    if delta_var < 5.0: 
        score += 0.35
        features_list.append("Unnatural Timbre Stability")
    
    # RULE 2: Vocoder Artifacts (Flatness)
    # Synthetic speech often has specific flatness signatures (too buzzy or too clean)
    if flatness_mean < 0.001: 
        score += 0.25
        features_list.append("Lack of Micro-Acoustic Detail")

    # RULE 3: Spectral Rolloff
    # Cheap 22khz models cut off sharply around 8-11khz
    if rolloff_mean < 3000: # Very muffled/low quality often AI downsampled
        score += 0.2
        features_list.append("Low-Frequency Cutoff (Vocoder Artifact)")

    # Normalize roughly
    fake_prob = min(1.0, score + (0.2 if mfcc_var < 400 else 0))
    
    # 3. Verdict
    category = "FAKE" if fake_prob > 0.50 else "REAL"
    confidence = fake_prob if category == "FAKE" else 1 - fake_prob

    return {
        "category": category,
        "confidence": round(confidence, 4),
        "riskScore": int(fake_prob * 100),
        "explanation": [
            f"Timbre Dynamics (Delta-MFCC): {'Suspiciously Stable' if delta_var < 5 else 'Natural'}",
            f"Spectral Flatness: {round(flatness_mean, 5)}",
            f"Rolloff Frequency: {int(rolloff_mean)} Hz"
        ],
        "modelDetails": {
            "architecture": "Signal Forensic Engine (Delta-MFCC + Rolloff)",
            "featuresAnalysed": [
                "temporal timbre consistency",
                "vocoder spectral cutoff",
                "noise floor flatness"
            ]
        },
        "userSummary": build_audio_summary(
            category=category,
            risk_score=int(fake_prob * 100),
            confidence=confidence,
            features=features_list
        )
    }
