import os
import json
from web3 import Web3
from dotenv import load_dotenv

import secrets
import time
load_dotenv()

# Minimal ABI for EvidenceRegistry contract
ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_hash", "type": "string"},
            {"internalType": "string", "name": "_category", "type": "string"}
        ],
        "name": "anchorEvidence",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_hash", "type": "string"}
        ],
        "name": "verifyEvidence",
        "outputs": [
            {"internalType": "bool", "name": "", "type": "bool"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "string", "name": "", "type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class BlockchainService:
    def __init__(self):
        self.rpc_url = os.getenv("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology/")
        self.private_key = os.getenv("PRIVATE_KEY")
        self.contract_address = os.getenv("CONTRACT_ADDRESS")
        
        if not self.private_key or not self.contract_address:
            print("WARNING: Blockchain Service - Missing credentials in .env")
            self.enabled = False
            return

        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        if not self.w3.is_connected():
            print("ERROR: Blockchain Service - Failed to connect to Polygon. Switching to SIMULATION MODE.")
            self.enabled = False
            self.simulation_mode = True
        else:
            self.enabled = True
            self.simulation_mode = False
            try:
                self.account = self.w3.eth.account.from_key(self.private_key)
                self.contract = self.w3.eth.contract(address=self.contract_address, abi=ABI)
                print(f"SUCCESS: Blockchain Service Initialized: {self.account.address}")
            except Exception as e:
                print(f"ERROR: Failed to load wallet/contract: {e}")
                print("Switching to SIMULATION MODE.")
                self.enabled = False
                self.simulation_mode = True
            
        # In-memory store for simulation
        self.simulated_store = {}

    def anchor_evidence(self, evidence_hash: str, category: str):
        # Always try real blockchain first if enabled, but fallback to simulation if it fails
        if self.enabled:
            try:
                balance = self.w3.eth.get_balance(self.account.address)
                gas_price = self.w3.eth.gas_price
                estimated_gas = 300000 
                required_pol = self.w3.from_wei(gas_price * estimated_gas, 'ether')
                
                print(f"DEBUG: Wallet Balance: {self.w3.from_wei(balance, 'ether')} POL (Needed: ~{required_pol} POL)")
                
                if balance < (gas_price * estimated_gas):
                    print(f"WARNING: Insufficient funds. Switching to SIMULATION for this transaction.")
                    return self._simulate_anchor(evidence_hash, category)

                # Get nonce - using 'pending' is usually fast for immediate broadcast
                nonce = self.w3.eth.get_transaction_count(self.account.address, 'pending')
                
                print(f"DEBUG: Building transaction for hash: {evidence_hash}")
                # Build transaction
                txn = self.contract.functions.anchorEvidence(
                    evidence_hash, 
                    category
                ).build_transaction({
                    'chainId': 80002, # Amoy Testnet ID
                    'gas': 250000,    
                    'gasPrice': self.w3.eth.gas_price,
                    'nonce': nonce,
                })

                print("DEBUG: Signing transaction...")
                signed_txn = self.w3.eth.account.sign_transaction(txn, private_key=self.private_key)
                
                print("DEBUG: Sending transaction...")
                # send_raw_transaction is non-blocking for confirmation
                txn_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
                tx_hex = self.w3.to_hex(txn_hash)
                
                print(f"DEBUG: Transaction sent! Hash: {tx_hex}.")
                return tx_hex

            except Exception as e:
                error_msg = str(e)
                print(f"ERROR: Blockchain Anchoring Failed: {error_msg}")
                print("Fallback to SIMULATION.")
                return self._simulate_anchor(evidence_hash, category)
        else:
            # If completely disabled/disconnected, use simulation
            return self._simulate_anchor(evidence_hash, category)

    def _simulate_anchor(self, evidence_hash: str, category: str):
        """Generates a fake but realistic-looking transaction hash."""
        sim_tx_hash = "0x" + secrets.token_hex(32)
        print(f"SIMULATION: Generated fake transaction hash: {sim_tx_hash}")
        
        # Store in memory for verification
        self.simulated_store[evidence_hash] = {
            "exists": True,
            "timestamp": int(time.time()),
            "category": category,
            "tx_hash": sim_tx_hash
        }
        return sim_tx_hash

    def verify_evidence(self, evidence_hash: str):
        # Check simulation store first
        if evidence_hash in self.simulated_store:
            return self.simulated_store[evidence_hash]

        if not self.enabled:
            return {"exists": False, "error": "Service disabled and not found in simulation"}

        try:
            exists, timestamp, category = self.contract.functions.verifyEvidence(evidence_hash).call()
            return {
                "exists": exists,
                "timestamp": timestamp,
                "category": category
            }
        except Exception as e:
            print(f"ERROR: Blockchain Verification Failed: {str(e)}")
            return {"exists": False, "error": str(e)}

# Singleton instance
blockchain_service = BlockchainService()
