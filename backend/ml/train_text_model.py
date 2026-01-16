import pandas as pd
import torch

from datasets import Dataset
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)

# -----------------------------
# 1. Load dataset
# -----------------------------
df = pd.read_csv(
    "data/scam_dataset.csv",
    encoding="latin-1"
)

df = df[["v1", "v2"]]
df.columns = ["label", "text"]

df["label"] = df["label"].map({
    "ham": 0,
    "spam": 1
})

df = df.dropna()

print("Dataset loaded successfully")
print("Samples:", len(df))

# -----------------------------
# 2. Convert to HuggingFace Dataset
# -----------------------------
dataset = Dataset.from_pandas(df)

# -----------------------------
# 3. Tokenizer
# -----------------------------
tokenizer = DistilBertTokenizerFast.from_pretrained(
    "distilbert-base-uncased"
)

def tokenize(batch):
    return tokenizer(
        batch["text"],
        truncation=True,
        padding="max_length",
        max_length=128
    )

dataset = dataset.map(tokenize, batched=True)

dataset = dataset.rename_column("label", "labels")
dataset.set_format(
    type="torch",
    columns=["input_ids", "attention_mask", "labels"]
)

# -----------------------------
# 4. Train / Test split
# -----------------------------
dataset = dataset.train_test_split(test_size=0.2)

train_dataset = dataset["train"]
eval_dataset = dataset["test"]

# -----------------------------
# 5. Model
# -----------------------------
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=2
)

# -----------------------------
# 6. Training arguments
# -----------------------------
training_args = TrainingArguments(
    output_dir="ml/scam_model",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="ml/logs",
    logging_steps=50,
    save_total_limit=2,
    report_to="none"
)



# -----------------------------
# 7. Trainer
# -----------------------------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

# -----------------------------
# 8. TRAIN (THIS WAS MISSING)
# -----------------------------
print("Starting training...")
trainer.train()

# -----------------------------
# 9. Save model
# -----------------------------
trainer.save_model("ml/scam_model")
tokenizer.save_pretrained("ml/scam_model")

print("Training completed and model saved.")
