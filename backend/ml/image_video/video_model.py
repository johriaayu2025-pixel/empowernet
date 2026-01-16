import numpy as np
from .frame_sampler import sample_frames
from .face_detect import extract_faces
from .image_model import predict_image

def analyze_video(video_path):
    frames = sample_frames(video_path)
    scores = []

    for frame in frames:
        faces = extract_faces(frame)
        for face in faces:
            score = predict_image(face)
            scores.append(score)

    if not scores:
        return 0.0

    return float(np.mean(scores))
