// Environment configuration
// This file contains environment-specific settings

// Safe access to environment variables in browser using Vite's import.meta.env
const getEnvVar = (key: string, defaultValue: string = ""): string => {
  try {
    // Use Vite's import.meta.env for environment variables
    return import.meta.env[key] || defaultValue;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return defaultValue;
  }
};

export const ENV_CONFIG = {
  // Network configuration
  NETWORK: {
    name: getEnvVar("VITE_NETWORK_NAME", "Sepolia"),
    chainId: parseInt(getEnvVar("VITE_CHAIN_ID", "11155111")),
    rpcUrl: getEnvVar("VITE_RPC_URL", "https://1rpc.io/sepolia"),
    explorerUrl: getEnvVar("VITE_EXPLORER_URL", "https://sepolia.etherscan.io")
  },
  
  // API Keys (from environment variables)
  API_KEYS: {
    etherscan: getEnvVar("VITE_ETHERSCAN_API_KEY", "J8PU7AX1JX3RGEH1SNGZS4628BAH192Y3N"),
    walletConnect: getEnvVar("VITE_WALLET_CONNECT_PROJECT_ID", "e08e99d213c331aa0fd00f625de06e66")
  },
  
  // Contract addresses (from environment variables)
  CONTRACTS: {
    cipherChainVote: getEnvVar("VITE_CONTRACT_ADDRESS", "0x5Aa01B46347CAD9fDB45eDf40804B2F6512aCB9c")
  },
  
  // Feature flags
  FEATURES: {
    enableFHE: getEnvVar("VITE_ENABLE_FHE", "true") !== "false",
    enableDemoMode: getEnvVar("VITE_DEMO_MODE", "false") === "true",
    enableDebugLogs: getEnvVar("VITE_DEBUG_LOGS", "false") === "true"
  }
} as const;

// Export individual configs for convenience
export const NETWORK_CONFIG = ENV_CONFIG.NETWORK;
export const API_KEYS = ENV_CONFIG.API_KEYS;
export const CONTRACT_ADDRESSES = ENV_CONFIG.CONTRACTS;
export const FEATURE_FLAGS = ENV_CONFIG.FEATURES;