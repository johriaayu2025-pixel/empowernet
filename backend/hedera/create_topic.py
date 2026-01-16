import os
from hiero_sdk_python import (
    Client,
    TopicCreateTransaction,
    AccountId,
    PrivateKey
)
from dotenv import load_dotenv

# Load .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

def create_topic():
    account_id = os.getenv("HEDERA_ACCOUNT_ID")
    private_key = os.getenv("HEDERA_PRIVATE_KEY")

    if not account_id or not private_key:
        print("❌ Error: HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY missing in .env")
        return

    try:
        client = Client.forTestnet()
        client.setOperator(
            AccountId.fromString(account_id),
            PrivateKey.fromString(private_key)
        )

        print("🚀 Creating Hedera Topic...")
        transaction = TopicCreateTransaction().setTopicMemo("EmpowerNet Forensic Ledger")
        response = transaction.execute(client)
        receipt = response.getReceipt(client)

        topic_id = receipt.topicId.toString()
        print(f"✅ Topic Created successfully!")
        print(f"📌 TOPIC_ID: {topic_id}")
        print("\n👇 ADD THIS TO YOUR .env FILE:")
        print(f"HEDERA_TOPIC_ID={topic_id}")

    except Exception as e:
        print(f"❌ Error creating topic: {e}")

if __name__ == "__main__":
    create_topic()
