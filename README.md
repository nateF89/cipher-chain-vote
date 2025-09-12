# Cipher Chain Vote

A decentralized cross-chain governance platform with zero-knowledge privacy protection. Vote anonymously across multiple blockchains with encrypted ballots and decentralized aggregation.

## Features

- **Private by Design**: Zero-knowledge proofs ensure your vote remains completely private while maintaining verifiability
- **Cross-Chain Native**: Govern across multiple blockchains with unified proposals and aggregated results
- **Truly Decentralized**: No central authority or single point of failure. Pure peer-to-peer governance
- **FHE Integration**: Fully Homomorphic Encryption for secure vote processing
- **Wallet Integration**: Support for multiple wallet providers including Rainbow, MetaMask, and WalletConnect

## Technologies

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Blockchain**: Wagmi, Viem, RainbowKit
- **Privacy**: FHE (Fully Homomorphic Encryption)
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Web3 wallet (MetaMask, Rainbow, etc.)

### Installation

```sh
# Clone the repository
git clone https://github.com/nateF89/cipher-chain-vote.git

# Navigate to the project directory
cd cipher-chain-vote

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

## Smart Contracts

The project includes FHE-enabled smart contracts for secure voting:

- **Voting Contract**: Handles proposal creation and voting with encrypted data
- **Governance Contract**: Manages cross-chain governance operations
- **Privacy Contract**: Implements zero-knowledge proof verification

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```sh
# Build the project
npm run build

# Preview the build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
