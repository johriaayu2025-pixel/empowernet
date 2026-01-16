from ml.text_infer import analyze_text
import time

print("Testing Text Model...")
start = time.time()
res_spam = analyze_text("URGENT! Your bank account is locked. Click here to verify: http://bit.ly/scam")
print(f"Time: {time.time()-start:.2f}s")
print("SPAM Result:", res_spam)

print("-" * 20)

res_ham = analyze_text("Hey, are we still meeting for lunch tomorrow?")
print("HAM Result:", res_ham)

assert res_spam['category'] == 'SCAM'
assert res_ham['category'] == 'SAFE'
print("✅ Text Test Passed")
