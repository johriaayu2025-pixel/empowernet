import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

rpc_url = os.getenv('POLYGON_RPC_URL')
private_key = os.getenv('PRIVATE_KEY')

print(f"Connecting to: {rpc_url}")
w3 = Web3(Web3.HTTPProvider(rpc_url))

if not w3.is_connected():
    print("FAILED: Could not connect to Polygon RPC")
    exit(1)

acct = w3.eth.account.from_key(private_key)
balance_wei = w3.eth.get_balance(acct.address)
balance_eth = w3.from_wei(balance_wei, 'ether')

print(f"Address: {acct.address}")
print(f"Balance: {balance_eth} POL")
print(f"Transaction Count (Nonce): {w3.eth.get_transaction_count(acct.address)}")
print(f"Gas Price: {w3.eth.gas_price}")
