# Configuration Guide

This document explains how to configure the Cipher Chain Vote application.

## Configuration Files

### 1. `src/config/contracts.ts`
Main contract configuration file containing:
- Contract addresses
- Network settings
- API keys
- Deployment information
- Demo proposals

### 2. `src/config/env.ts`
Environment-specific configuration that reads from environment variables:
- Network settings
- API keys
- Contract addresses
- Feature flags

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Network Configuration
VITE_NETWORK_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://1rpc.io/sepolia
VITE_EXPLORER_URL=https://sepolia.etherscan.io

# Contract Addresses
VITE_CONTRACT_ADDRESS=0x29e63fa6Ee973217F119728a850c5f2cED153510

# API Keys
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key_here
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here

# Feature Flags
VITE_ENABLE_FHE=true
VITE_DEMO_MODE=false
VITE_DEBUG_LOGS=false
```

## Usage

### Importing Configuration

```typescript
// Import main contract configuration
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORK_CONFIG } from '@/config/contracts';

// Import environment configuration
import { ENV_CONFIG, FEATURE_FLAGS } from '@/config/env';
```

### Updating Contract Address

When deploying a new contract, the deployment script automatically updates the contract address in `src/config/contracts.ts`.

### Adding New Configuration

1. Add new fields to `src/config/env.ts` for environment variables
2. Update `src/config/contracts.ts` to use the new environment variables
3. Update this documentation

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive information like API keys
- The `.env.example` file shows the required format without sensitive values
