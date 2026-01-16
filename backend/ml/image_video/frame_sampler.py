import cv2

def sample_frames(video_path, max_frames=20):
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 25

    frames = []
    frame_id = 0

    while cap.isOpened() and len(frames) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % fps == 0:
            frames.append(frame)

        frame_id += 1

    cap.release()
    return frames
