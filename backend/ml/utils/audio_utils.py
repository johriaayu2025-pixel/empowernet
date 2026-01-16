import numpy as np
import librosa

def extract_audio_features(y, sr):
    features = {}

    # Pitch variation (AI voices are too stable)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[pitches > 0]
    features["pitch_std"] = np.std(pitch_values) if len(pitch_values) else 0

    # Spectral flatness (AI voices often too clean)
    features["spectral_flatness"] = np.mean(
        librosa.feature.spectral_flatness(y=y)
    )

    # Zero crossing rate
    features["zcr"] = np.mean(
        librosa.feature.zero_crossing_rate(y)
    )

    # Energy entropy
    rms = librosa.feature.rms(y=y)[0]
    energy_prob = rms / np.sum(rms)
    features["energy_entropy"] = -np.sum(
        energy_prob * np.log2(energy_prob + 1e-9)
    )

    return features
