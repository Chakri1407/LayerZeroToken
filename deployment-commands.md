# OFT Deployment and Configuration Guide

## Prerequisites
Make sure you have testnet tokens:
- **Holesky ETH**: Get from [Holesky Faucet](https://holesky-faucet.pk910.de/)
- **Amoy POL**: Get from [Polygon Faucet](https://faucet.polygon.technology/)

## Step 1: Deploy OFT Contracts

### Deploy to Holesky
```bash
npx hardhat deploy --network holesky --tags MyOFT
```

### Deploy to Amoy  
```bash
npx hardhat deploy --network amoy --tags MyOFT
```

## Step 2: Configure LayerZero Connections

### Set peers (connect the contracts)
```bash
npx hardhat lz:oapp:config:set --oapp-config layerzero.config.ts
```

## Step 3: Mint tokens on source chain (Holesky)

Create a script to mint tokens:

### Create mint script
```bash
npx hardhat run scripts/mint.ts --network holesky
```

## Step 4: Transfer tokens from Holesky to Amoy

### Send tokens cross-chain
```bash
npx hardhat run scripts/send.ts --network holesky
```

## Useful Commands

### Check deployed contracts
```bash
npx hardhat lz:oapp:config:get:default
```

### Verify deployment
```bash
npx hardhat verify --network holesky DEPLOYED_CONTRACT_ADDRESS "LayerZeroToken" "LZT" ENDPOINT_ADDRESS DEPLOYER_ADDRESS
npx hardhat verify --network amoy DEPLOYED_CONTRACT_ADDRESS "LayerZeroToken" "LZT" ENDPOINT_ADDRESS DEPLOYER_ADDRESS
```

### Check OFT configuration
```bash
npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts
```