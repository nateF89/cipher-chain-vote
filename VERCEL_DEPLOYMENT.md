# Vercel Deployment Guide for Cipher Chain Vote

This guide provides step-by-step instructions for deploying the Cipher Chain Vote application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository access
- Environment variables ready

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" on the dashboard
3. Import your GitHub repository:
   - Click "Import Git Repository"
   - Select `nateF89/cipher-chain-vote` from the list
   - Click "Import"

### 2. Configure Project Settings

1. **Project Name**: `cipher-chain-vote`
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### 3. Environment Variables

Add the following environment variables in the Vercel dashboard:

#### Required Environment Variables

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
VITE_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
VITE_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
VITE_RPC_URL_ALT=https://1rpc.io/sepolia
```

#### How to Add Environment Variables

1. In the project settings, go to "Environment Variables"
2. Click "Add New"
3. Add each variable with the following settings:
   - **Name**: The variable name (e.g., `VITE_CHAIN_ID`)
   - **Value**: The variable value (e.g., `11155111`)
   - **Environment**: Select "Production", "Preview", and "Development"

### 4. Deploy

1. Click "Deploy" button
2. Wait for the build process to complete
3. Your application will be available at the provided Vercel URL

### 5. Custom Domain (Optional)

1. Go to "Domains" in project settings
2. Add your custom domain
3. Configure DNS settings as instructed by Vercel
4. Wait for SSL certificate to be issued

## Build Configuration

The project uses the following build configuration:

- **Framework**: Vite + React + TypeScript
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x (recommended)

## Environment Variables Reference

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_CHAIN_ID` | Ethereum chain ID for Sepolia testnet | `11155111` |
| `VITE_RPC_URL` | Primary RPC URL for blockchain connection | `https://sepolia.infura.io/v3/...` |
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | `2ec9743d0d0cd7fb94dee1a7e6d33475` |
| `VITE_INFURA_API_KEY` | Infura API key for RPC access | `b18fb7e6ca7045ac83c41157ab93f990` |
| `VITE_RPC_URL_ALT` | Alternative RPC URL | `https://1rpc.io/sepolia` |

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all environment variables are set
   - Ensure Node.js version is 18.x or higher
   - Verify all dependencies are properly installed

2. **Wallet Connection Issues**
   - Verify WalletConnect project ID is correct
   - Check RPC URLs are accessible
   - Ensure chain ID matches the network

3. **Contract Interaction Issues**
   - Verify contract address is correct
   - Check that the contract is deployed on the correct network
   - Ensure user has sufficient funds for gas fees

### Build Logs

If deployment fails, check the build logs in Vercel dashboard:
1. Go to "Deployments" tab
2. Click on the failed deployment
3. Review the build logs for specific error messages

## Post-Deployment

After successful deployment:

1. Test wallet connection functionality
2. Verify contract interactions work properly
3. Test voting functionality
4. Check responsive design on different devices
5. Monitor performance and error rates

## Security Considerations

- Never commit private keys or sensitive data to the repository
- Use environment variables for all sensitive configuration
- Regularly rotate API keys and access tokens
- Monitor for any security vulnerabilities in dependencies

## Support

For deployment issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review build logs for specific error messages
- Ensure all environment variables are properly configured
- Verify network connectivity and RPC endpoint availability

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)
- [Web3 Integration Guide](https://wagmi.sh/getting-started)
