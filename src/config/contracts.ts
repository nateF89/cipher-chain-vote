// Contract configuration file - centralized management of all contract addresses
import { ENV_CONFIG } from './env';

export const CONTRACT_CONFIG = {
  // Main contract address (from environment or default)
  CIPHER_CHAIN_VOTE: ENV_CONFIG.CONTRACTS.cipherChainVote,
  
  // Network configuration (from environment or defaults)
  NETWORK: ENV_CONFIG.NETWORK,
  
  // API Keys (from environment or defaults)
  API_KEYS: ENV_CONFIG.API_KEYS,
  
  // Contract ABI (imported from TypeScript file)
  ABI: null, // Will be imported from contract.ts
  
  // Deployment information
  DEPLOYMENT: {
    deployer: "0xBc997bA1d5F89133a37E3c2441C97e9D03F10d7D",
    verifier: "0xBc997bA1d5F89133a37E3c2441C97e9D03F10d7D",
    deploymentTime: "2024-10-18T03:45:00.000Z",
    network: "sepolia"
  },
  
  // Demo proposals created during deployment
  DEMO_PROPOSALS: [
    {
      id: 0,
      title: "Increase Cross-Chain Bridge Security",
      description: "Proposal to implement additional security measures for cross-chain asset transfers and governance communications.",
      category: "security",
      priority: "high",
      tags: "security, cross-chain, bridge, encryption"
    },
    {
      id: 1,
      title: "Multi-Chain Treasury Allocation", 
      description: "Distribute treasury funds across multiple chains to support ecosystem growth and development initiatives.",
      category: "treasury",
      priority: "high",
      tags: "treasury, multi-chain, allocation, development"
    },
    {
      id: 2,
      title: "Privacy Protocol Upgrade",
      description: "Upgrade to latest zero-knowledge proof system for enhanced voting privacy and ballot encryption.",
      category: "technical",
      priority: "medium",
      tags: "privacy, encryption, FHE, zero-knowledge, upgrade"
    }
  ]
} as const;

// Export main contract address as default
export const CONTRACT_ADDRESS = CONTRACT_CONFIG.CIPHER_CHAIN_VOTE;

// Export network configuration
export const NETWORK_CONFIG = CONTRACT_CONFIG.NETWORK;

// Export ABI
export const CONTRACT_ABI = CONTRACT_CONFIG.ABI;

// Export API keys
export const API_KEYS = CONTRACT_CONFIG.API_KEYS;

// Export deployment info
export const DEPLOYMENT_INFO = CONTRACT_CONFIG.DEPLOYMENT;

// Export demo proposals
export const DEMO_PROPOSALS = CONTRACT_CONFIG.DEMO_PROPOSALS;
