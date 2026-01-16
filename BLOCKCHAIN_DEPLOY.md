# Blockchain Deployment Guide

## 1. Prerequisites
- **Node.js** & **npm**
- **Wallet Private Key** (Export from MetaMask, use a TEST ACCOUNT).
- **RPC URL** (Get free from Alchemy or Infura for Polygon Amoy or Sepolia).
- **Testnet Tokens** (Get MATIC from `faucet.polygon.technology` or Sepolia ETH).

## 2. Deploy Smart Contract
We will use `remix.ethereum.org` for the simplest deployment (no hardhat setup needed).

1.  Go to [Remix IDE](https://remix.ethereum.org/).
2.  Create a new file `EvidenceRegistry.sol`.
3.  Copy the code from `backend/blockchain/EvidenceRegistry.sol`.
4.  Compile the contract (Solidity Compiler tab).
5.  Go to "Deploy & Run Transactions" tab.
    *   Environment: **Injected Provider - MetaMask** (Ensure execution on Testnet).
    *   Click **Deploy**.
    *   Confirm transaction in MetaMask.
6.  **Copy the Deployed Contract Address**.

## 3. Configure Backend
Open `backend/.env` (create if missing) and set:

```ini
BLOCKCHAIN_RPC_URL=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=YOUR_PRIVATE_KEY_here
CONTRACT_ADDRESS=0xComputedAddressFromRemix
```

## 4. Test Verification
1.  Restart Backend: `uvicorn main:app --reload --port 8001`
2.  Run a Scan on the Frontend.
3.  Check Backend logs: You should see "🔗 Evidence Anchored! Tx: 0x...".
4.  Copy the `evidenceHash` from the UI.
5.  Go to the **Verify** tab, paste the hash, and click Verify.
6.  You should see "✅ Evidence Verified".
