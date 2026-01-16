import torch
import numpy
print(f"Torcb Version: {torch.__version__}")
print(f"Numpy Version: {numpy.__version__}")

try:
    from ml.image_infer import analyze_image_base64, model
    print("✅ Image Model Imported Successfully")
except Exception as e:
    print(f"❌ Import Failed: {e}")
    exit(1)

# Dummy base64 image (1x1 pixel)
dummy_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6DwABBAEAAAAA"

print("Running Inference...")
try:
    res = analyze_image_base64(dummy_b64)
    print("Result:", res)
    if "error" in res:
        print("❌ Inference returned error")
    else:
        print("✅ Inference Success")
except Exception as e:
    print(f"❌ Inference Crashed: {e}")
