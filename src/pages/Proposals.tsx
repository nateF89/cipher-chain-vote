import { useState } from "react";
import { ProposalCard } from "@/components/ProposalCard";
import { CreateProposalModal } from "@/components/CreateProposalModal";
import { Button } from "@/components/ui/button";
import { ChainSelector } from "@/components/ChainSelector";
import { WalletConnect } from "@/components/WalletConnect";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const mockProposals = [
  {
    id: "1",
    title: "Increase Cross-Chain Bridge Security",
    description: "Proposal to implement additional security measures for cross-chain asset transfers and governance communications.",
    status: "active" as const,
    votesFor: 1250,
    votesAgainst: 340,
    totalVotes: 1590,
    timeLeft: "3 days left",
    privacy: "private" as const,
    chain: "Ethereum"
  },
  {
    id: "2", 
    title: "Multi-Chain Treasury Allocation",
    description: "Distribute treasury funds across multiple chains to support ecosystem growth and development initiatives.",
    status: "active" as const,
    votesFor: 890,
    votesAgainst: 450,
    totalVotes: 1340,
    timeLeft: "5 days left",
    privacy: "private" as const,
    chain: "Polygon"
  },
  {
    id: "3",
    title: "Privacy Protocol Upgrade",
    description: "Upgrade to latest zero-knowledge proof system for enhanced voting privacy and ballot encryption.",
    status: "pending" as const,
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    timeLeft: "Starts in 2 days",
    privacy: "private" as const,
    chain: "Arbitrum"
  }
];

interface ProposalsProps {
  isWalletConnected: boolean;
  walletAddress?: string;
  selectedChain: string;
  onChainSelect: (chain: string) => void;
  onVote: (proposalId: string) => void;
}

const Proposals = ({ 
  isWalletConnected, 
  walletAddress, 
  selectedChain, 
  onChainSelect, 
  onVote 
}: ProposalsProps) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateProposal = (proposalData: any) => {
    console.log("Creating proposal:", proposalData);
    // In a real app, this would submit to the blockchain
    setCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-cyber-purple/20 bg-glass-bg/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="w-px h-6 bg-border"></div>
              <h1 className="text-2xl font-bold text-foreground">Active Proposals</h1>
            </div>
            <div className="flex items-center gap-4">
              <ChainSelector selectedChain={selectedChain} onChainSelect={onChainSelect} />
              <WalletConnect />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isWalletConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-foreground mb-4">Connect Your Wallet</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect your wallet to participate in cross-chain governance
            </p>
            <WalletConnect />
          </div>
        ) : (
          <>
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Active Proposals</h2>
                <p className="text-muted-foreground">
                  Participate in cross-chain governance with complete privacy
                </p>
              </div>
              <Button 
                variant="neon" 
                onClick={() => setCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Proposal
              </Button>
            </div>

            {/* Proposals Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProposals.map((proposal) => (
                <div key={proposal.id} className="animate-slide-in">
                  <ProposalCard 
                    proposal={proposal}
                    onVote={onVote}
                    isConnected={isWalletConnected}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Create Proposal Modal */}
      <CreateProposalModal 
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateProposal}
        selectedChain={selectedChain}
      />
    </div>
  );
};

export default Proposals;