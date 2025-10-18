import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';
import { ENV_CONFIG } from './env';

export const wagmiConfig = getDefaultConfig({
  appName: 'Cipher Chain Vote',
  projectId: ENV_CONFIG.API_KEYS.walletConnect,
  chains: [sepolia, mainnet, polygon, arbitrum, optimism],
  ssr: false,
});
