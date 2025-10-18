# Cipher Chain Vote

A decentralized cross-chain governance platform with **Fully Homomorphic Encryption (FHE)** privacy protection. Vote anonymously across multiple blockchains with encrypted ballots and decentralized aggregation.

## 🎥 Demo Video

[![FHE Vote Demo](https://img.shields.io/badge/📹_Watch_Demo-Video-blue?style=for-the-badge)](./fhe-vote-compressed.mp4)

**Video Size**: 9.6MB (compressed from 141MB)  
**Duration**: 2:22  
**Features Demonstrated**: Complete FHE voting flow, proposal creation, encrypted voting, result decryption

## 🔐 Privacy-First Architecture

### Fully Homomorphic Encryption (FHE) Implementation

This project implements **end-to-end FHE encryption** for voting data:

- **Encrypted Vote Storage**: All vote choices are encrypted using FHE (`euint32`)
- **Encrypted Vote Counting**: Vote tallies (`votesFor`, `votesAgainst`, `abstainVotes`, `totalVotes`) remain encrypted during active voting
- **Privacy-Preserving Results**: Vote results are only revealed after the voting period ends
- **Zero-Knowledge Verification**: Voters can verify their vote was counted without revealing their choice

### Smart Contract FHE Logic

```solidity
// Encrypted vote choice (1: Yes, 2: No, 3: Abstain)
euint32 voteChoice = FHE.fromExternal(externalVoteChoice, inputProof);

// FHE conditional operations for vote counting
ebool isYes = FHE.eq(voteChoice, FHE.asEuint32(1));
ebool isNo = FHE.eq(voteChoice, FHE.asEuint32(2));
ebool isAbstain = FHE.eq(voteChoice, FHE.asEuint32(3));

// Update encrypted vote counts
votesFor = FHE.add(votesFor, FHE.select(isYes, FHE.asEuint32(1), FHE.asEuint32(0)));
votesAgainst = FHE.add(votesAgainst, FHE.select(isNo, FHE.asEuint32(1), FHE.asEuint32(0)));
abstainVotes = FHE.add(abstainVotes, FHE.select(isAbstain, FHE.asEuint32(1), FHE.asEuint32(0)));
```

## ✨ Key Features

- **🔒 Private by Design**: FHE ensures vote privacy while maintaining verifiability
- **🌐 Cross-Chain Native**: Govern across multiple blockchains with unified proposals
- **⚡ Real-time Updates**: Live vote counting with encrypted data
- **🎯 Simplified UX**: No voter registration required - direct participation
- **📊 Privacy-First Display**: Results hidden during voting, revealed after completion
- **🔗 Wallet Integration**: Support for MetaMask, Rainbow, WalletConnect

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: Wagmi + RainbowKit + Viem
- **FHE Integration**: Zama FHE SDK

### Smart Contracts
- **Language**: Solidity ^0.8.24
- **FHE Library**: @fhevm/solidity
- **Network**: Sepolia Testnet
- **Encryption**: Fully Homomorphic Encryption

### Development Tools
- **Hardhat**: Smart contract development
- **TypeScript**: Type safety
- **ESLint**: Code quality
- **Prettier**: Code formatting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm))
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/nateF89/cipher-chain-vote.git

# Navigate to the project directory
cd cipher-chain-vote

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Network Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://1rpc.io/sepolia

# API Keys
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key

# Contract Address (auto-updated on deployment)
VITE_CONTRACT_ADDRESS=0x5Aa01B46347CAD9fDB45eDf40804B2F6512aCB9c
```

## 📋 Smart Contract Details

### Contract Address
**Sepolia Testnet**: `0x5Aa01B46347CAD9fDB45eDf40804B2F6512aCB9c`

### Key Functions

#### Proposal Management
```solidity
function createProposal(
    string memory _title,
    string memory _description,
    uint256 _duration,
    uint256 _quorumThreshold,
    string memory _category,
    string memory _priority,
    string memory _tags,
    string memory _votingOptions,
    string memory _proposalHash,
    uint256 _chainId
) public returns (uint256)
```

#### FHE-Encrypted Voting
```solidity
function castVote(
    uint256 proposalId,
    externalEuint32 voteChoice,
    bytes calldata inputProof
) public returns (uint256)
```

#### Result Decryption
```solidity
function requestFinalize(uint256 proposalId) public
function decryptionCallback(uint256 proposalId, bytes memory signatures) public
function revealResults(uint256 proposalId) public
```

### FHE Data Structures

```solidity
struct Proposal {
    uint256 proposalId;
    string title;
    string description;
    euint32 votesFor;        // Encrypted vote count
    euint32 votesAgainst;    // Encrypted vote count
    euint32 abstainVotes;    // Encrypted vote count
    euint32 totalVotes;      // Encrypted total votes
    bool isActive;
    bool isEnded;
    // ... additional fields
}

struct Vote {
    uint256 voteId;
    euint32 voteChoice;      // Encrypted: 1=Yes, 2=No, 3=Abstain
    address voter;
    uint256 timestamp;
    bool isEncrypted;
}
```

## 🔄 FHE Encryption Flow

### 1. Vote Encryption (Frontend)
```typescript
// Client-side FHE encryption
const { instance } = useZamaInstance();
const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
input.add32(voteChoice); // 1, 2, or 3
const encryptedInput = await input.encrypt();
```

### 2. Encrypted Vote Submission
```typescript
// Submit encrypted vote to contract
await contract.castVote(
    proposalId,
    encryptedInput.handles[0],
    encryptedInput.inputProof
);
```

### 3. FHE Vote Processing (Smart Contract)
```solidity
// Convert external encrypted data to internal FHE type
euint32 internalVoteChoice = FHE.fromExternal(voteChoice, inputProof);

// FHE conditional operations for vote counting
ebool isYes = FHE.eq(internalVoteChoice, FHE.asEuint32(1));
proposals[proposalId].votesFor = FHE.add(
    proposals[proposalId].votesFor, 
    FHE.select(isYes, FHE.asEuint32(1), FHE.asEuint32(0))
);
```

### 4. Result Decryption (Post-Voting)
```solidity
// Request decryption from FHE oracle
function requestFinalize(uint256 proposalId) public {
    proposals[proposalId].decryptionPending = true;
    // Oracle processes encrypted results
}

// Reveal decrypted results
function revealResults(uint256 proposalId) public {
    proposals[proposalId].resultsRevealed = true;
    // Results become publicly visible
}
```

## 🎯 Usage Guide

### Creating a Proposal

1. **Connect Wallet**: Use MetaMask or supported wallet
2. **Click "Create Proposal"**: Fill in proposal details
3. **Set Duration**: Choose between days or specific end date
4. **Submit**: Transaction creates proposal on-chain

### Voting Process

1. **Select Proposal**: Choose from active proposals
2. **Cast Vote**: Select Yes/No/Abstain (encrypted client-side)
3. **Confirm Transaction**: Vote is encrypted and submitted
4. **Wait for Results**: Results revealed after voting period

### Privacy Features

- **Encrypted Vote Storage**: All votes encrypted using FHE
- **Privacy-First Display**: Results hidden during active voting
- **Anonymous Participation**: No voter registration required
- **Verifiable Results**: Transparent decryption process

## 🚀 Deployment

### Smart Contract Deployment

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.cjs --network sepolia
```

### Frontend Deployment

#### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

#### Manual Build
```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

## 🔧 Development

### Project Structure
```
cipher-chain-vote/
├── contracts/           # Smart contracts
│   └── CipherChainVote.sol
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks (FHE, contract)
│   ├── lib/            # Utilities (FHE utils, contract ABI)
│   └── pages/         # Application pages
├── scripts/             # Deployment scripts
└── public/             # Static assets
```

### Key Files
- `contracts/CipherChainVote.sol` - Main FHE-enabled smart contract
- `src/hooks/useContract.ts` - Contract interaction hooks
- `src/hooks/useZamaInstance.ts` - FHE SDK integration
- `src/lib/fhe-utils.ts` - FHE utility functions
- `scripts/deploy.cjs` - Contract deployment script

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 🔒 Security Considerations

### FHE Security
- **Encrypted Processing**: All vote data encrypted during processing
- **Access Control Lists (ACL)**: Proper permission management
- **Decryption Oracle**: Secure result decryption process

### Smart Contract Security
- **Input Validation**: Comprehensive parameter validation
- **Access Control**: Owner and verifier role management
- **State Management**: Proper proposal lifecycle management

### Frontend Security
- **Client-Side Encryption**: Votes encrypted before submission
- **Wallet Integration**: Secure transaction signing
- **Environment Variables**: Sensitive data properly configured

## 📊 Performance

### Video Compression
- **Original Size**: 141MB
- **Compressed Size**: 9.6MB
- **Compression Ratio**: 93% reduction
- **Format**: MP4 (H.264)

### Smart Contract Gas Usage
- **Create Proposal**: ~200,000 gas
- **Cast Vote**: ~150,000 gas
- **End Proposal**: ~50,000 gas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: FHE technology and SDK
- **FHEVM**: Solidity FHE integration
- **Wagmi**: React hooks for Ethereum
- **shadcn/ui**: Beautiful UI components

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/nateF89/cipher-chain-vote/wiki)
- **Issues**: [GitHub Issues](https://github.com/nateF89/cipher-chain-vote/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nateF89/cipher-chain-vote/discussions)

---

**Built with ❤️ using FHE technology for privacy-preserving governance**