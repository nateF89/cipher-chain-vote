// Environment configuration
// This file contains environment-specific settings

export const ENV_CONFIG = {
  // Network configuration
  NETWORK: {
    name: process.env.VITE_NETWORK_NAME || "Sepolia",
    chainId: parseInt(process.env.VITE_CHAIN_ID || "11155111"),
    rpcUrl: process.env.VITE_RPC_URL || "https://1rpc.io/sepolia",
    explorerUrl: process.env.VITE_EXPLORER_URL || "https://sepolia.etherscan.io"
  },
  
  // API Keys (from environment variables)
  API_KEYS: {
    etherscan: process.env.VITE_ETHERSCAN_API_KEY || "",
    walletConnect: process.env.VITE_WALLET_CONNECT_PROJECT_ID || ""
  },
  
  // Contract addresses (from environment variables)
  CONTRACTS: {
    cipherChainVote: process.env.VITE_CONTRACT_ADDRESS || "0x29e63fa6Ee973217F119728a850c5f2cED153510"
  },
  
  // Feature flags
  FEATURES: {
    enableFHE: process.env.VITE_ENABLE_FHE !== "false",
    enableDemoMode: process.env.VITE_DEMO_MODE === "true",
    enableDebugLogs: process.env.VITE_DEBUG_LOGS === "true"
  }
} as const;

// Export individual configs for convenience
export const NETWORK_CONFIG = ENV_CONFIG.NETWORK;
export const API_KEYS = ENV_CONFIG.API_KEYS;
export const CONTRACT_ADDRESSES = ENV_CONFIG.CONTRACTS;
export const FEATURE_FLAGS = ENV_CONFIG.FEATURES;