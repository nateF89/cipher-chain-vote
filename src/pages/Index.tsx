import { WalletConnect } from "@/components/WalletConnect";
import { ChainSelector } from "@/components/ChainSelector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock, Users, Vote, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/governance-hero-bg.jpg";
import logoImage from "@/assets/logo.svg";

interface IndexProps {
  isWalletConnected: boolean;
  walletAddress?: string;
  selectedChain: string;
  onChainSelect: (chain: string) => void;
  onVote: (proposalId: string) => void;
}

const Index = ({ 
  isWalletConnected, 
  walletAddress, 
  selectedChain, 
  onChainSelect, 
  onVote 
}: IndexProps) => {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Navigation */}
          <nav className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="Cipher Chain Vote Logo" 
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-foreground">CipherChain</span>
            </div>
            <div className="flex items-center gap-4">
              <ChainSelector selectedChain={selectedChain} onChainSelect={onChainSelect} />
              <WalletConnect />
            </div>
          </nav>

          {/* Hero Content */}
          <div className="animate-slide-in space-y-8 mt-20">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight">
                Govern{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent animate-glow-pulse">
                  Everywhere
                </span>
                ,<br />
                <span className="text-cyber-purple">Privately</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Cross-chain governance with zero-knowledge privacy. Vote anonymously across multiple blockchains with encrypted ballots and decentralized aggregation.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="outline" className="border-cyber-purple/50 text-cyber-purple px-4 py-2 text-base">
                <Globe className="w-4 h-4 mr-2" />
                Multi-Chain
              </Badge>
              <Badge variant="outline" className="border-cyber-cyan/50 text-cyber-cyan px-4 py-2 text-base">
                <Lock className="w-4 h-4 mr-2" />
                Zero-Knowledge
              </Badge>
              <Badge variant="outline" className="border-cyber-green/50 text-cyber-green px-4 py-2 text-base">
                <Users className="w-4 h-4 mr-2" />
                Decentralized
              </Badge>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      {isWalletConnected && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">Ready to Participate?</h2>
              <p className="text-xl text-muted-foreground">
                Join the future of cross-chain governance and vote on active proposals
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/proposals">
                  <Button 
                    variant="neon" 
                    size="lg" 
                    className="gap-2"
                  >
                    <Vote className="w-5 h-5" />
                    View Active Proposals
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-glass-bg/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            The Future of Decentralized Governance
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyber-purple/20 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-cyber-purple" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Private by Design</h4>
              <p className="text-muted-foreground">
                Zero-knowledge proofs ensure your vote remains completely private while maintaining verifiability.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyber-cyan/20 rounded-lg flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-cyber-cyan" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Cross-Chain Native</h4>
              <p className="text-muted-foreground">
                Govern across multiple blockchains with unified proposals and aggregated results.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyber-green/20 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-cyber-green" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Truly Decentralized</h4>
              <p className="text-muted-foreground">
                No central authority or single point of failure. Pure peer-to-peer governance.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
