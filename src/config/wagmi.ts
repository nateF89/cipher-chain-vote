import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';
import { config } from './env';

export const wagmiConfig = getDefaultConfig({
  appName: 'Cipher Chain Vote',
  projectId: config.walletConnectProjectId,
  chains: [sepolia, mainnet, polygon, arbitrum, optimism],
  ssr: false,
});
