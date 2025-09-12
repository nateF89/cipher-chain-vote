import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, Shield } from "lucide-react";

export function WalletConnect() {
  return (
    <div className="flex items-center gap-2">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="flex items-center gap-2 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white px-4 py-2 rounded-lg font-medium hover:from-cyber-purple/80 hover:to-cyber-cyan/80 transition-all duration-300 shadow-lg hover:shadow-cyber-purple/25"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-all duration-300"
                    >
                      <Shield className="w-4 h-4" />
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-3 bg-glass-bg/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-cyber-green animate-glow-pulse"></div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-foreground">
                        {account.displayName}
                      </span>
                    </div>
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Manage
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}