import { useState } from "react";
import { ProposalCard } from "@/components/ProposalCard";
import { CreateProposalModal } from "@/components/CreateProposalModal";
import { Button } from "@/components/ui/button";
import { ChainSelector } from "@/components/ChainSelector";
import { WalletConnect } from "@/components/WalletConnect";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.svg";
import { useAllProposals, useProposalCount } from "@/hooks/useContract";

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
  
  // Load real data from contract
  const { proposals, isLoading: isLoadingProposals, error: proposalsError } = useAllProposals();
  const { count: proposalCount } = useProposalCount();

  console.log('🔍 Proposals page: Loading real data from contract...');
  console.log('📊 Proposal count:', proposalCount);
  console.log('📋 Loaded proposals:', proposals.length);
  console.log('⏳ Loading state:', isLoadingProposals);
  console.log('❌ Error state:', proposalsError);

  // 计算真实统计数据
  const totalParticipants = proposals.reduce((sum, proposal) => sum + (proposal.totalVotes || 0), 0);
  const activeProposals = proposals.filter(p => p.isActive && !p.isEnded).length;
  const endedProposals = proposals.filter(p => p.isEnded).length;
  
  console.log('📊 Real statistics:', {
    totalParticipants,
    activeProposals,
    endedProposals,
    totalProposals: proposals.length
  });

  // Convert contract data to display format
  const displayProposals = proposals.map((proposal) => {
    const now = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
    const endTime = Math.floor(proposal.endTime); // 确保 endTime 是整数
    const timeLeft = endTime - now;
    
    console.log(`🕐 Proposal ${proposal.id} time calculation:`, {
      now,
      endTime: proposal.endTime,
      endTimeFloor: endTime,
      timeLeft,
      isActive: proposal.isActive,
      isEnded: proposal.isEnded
    });
    
    const isActive = proposal.isActive && !proposal.isEnded && timeLeft > 0;
    const isPending = !proposal.isActive && timeLeft > 0;
    
    let status: "active" | "pending" | "ended" = "ended";
    let timeLeftText = "Ended";
    
    if (isActive) {
      status = "active";
      const days = Math.floor(timeLeft / 86400);
      // 防止显示异常大的天数
      if (days > 365) {
        timeLeftText = "Invalid time";
        console.error(`❌ Invalid time calculation for proposal ${proposal.id}:`, {
          timeLeft,
          days,
          endTime: proposal.endTime,
          now
        });
      } else {
        timeLeftText = days > 0 ? `${days} day${days > 1 ? 's' : ''} left` : "Ending soon";
      }
    } else if (isPending) {
      status = "pending";
      const days = Math.floor(timeLeft / 86400);
      if (days > 365) {
        timeLeftText = "Invalid time";
        console.error(`❌ Invalid time calculation for proposal ${proposal.id}:`, {
          timeLeft,
          days,
          endTime: proposal.endTime,
          now
        });
      } else {
        timeLeftText = `Starts in ${days} day${days > 1 ? 's' : ''}`;
      }
    }

    console.log(`🎨 Converting proposal ${proposal.id}:`, {
      title: proposal.title,
      status,
      timeLeft: timeLeftText,
      isActive,
      isEnded: proposal.isEnded
    });

    // 只有在投票结束后才显示投票结果
    const showResults = proposal.isEnded || status === "ended";
    
    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      status,
      // 投票过程中隐藏结果，投票结束后显示
      votesFor: showResults ? (proposal.votesFor || 0) : 0,
      votesAgainst: showResults ? (proposal.votesAgainst || 0) : 0,
      totalVotes: showResults ? (proposal.totalVotes || 0) : 0,
      timeLeft: timeLeftText,
      privacy: "private" as const,
      chain: selectedChain,
      category: proposal.category,
      priority: proposal.priority,
      tags: proposal.tags,
      proposer: proposal.proposer,
      quorumThreshold: proposal.quorumThreshold,
      // 添加参与人数（从链上读取）
      participants: proposal.totalVotes || 0
    };
  });

  console.log('🎨 Converted proposals for display:', displayProposals);

  const handleCreateProposal = (proposalData: any) => {
    console.log("✅ Creating proposal:", proposalData);
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
              <div className="flex items-center gap-3">
                <img 
                  src={logoImage} 
                  alt="Cipher Chain Vote Logo" 
                  className="w-8 h-8"
                />
                <h1 className="text-2xl font-bold text-foreground">Active Proposals</h1>
              </div>
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
                {!isLoadingProposals && (
                  <div className="flex items-center gap-6 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-green font-semibold">{activeProposals}</span>
                      <span className="text-muted-foreground">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-semibold">{endedProposals}</span>
                      <span className="text-muted-foreground">Ended</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-cyan font-semibold">{totalParticipants}</span>
                      <span className="text-muted-foreground">Total Participants</span>
                    </div>
                  </div>
                )}
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

            {/* Loading State */}
            {isLoadingProposals && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cyber-purple" />
                <span className="ml-2 text-muted-foreground">Loading proposals from contract...</span>
              </div>
            )}

            {/* Error State */}
            {proposalsError && (
              <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-300">Failed to load proposals: {proposalsError.message}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingProposals && !proposalsError && displayProposals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Plus className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Proposals Yet</h3>
                  <p className="text-muted-foreground">Be the first to create a governance proposal</p>
                </div>
                <Button 
                  onClick={() => setCreateModalOpen(true)}
                  variant="neon"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create First Proposal
                </Button>
              </div>
            )}

            {/* Proposals Grid */}
            {!isLoadingProposals && displayProposals.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayProposals.map((proposal) => (
                  <div key={proposal.id} className="animate-slide-in">
                    <ProposalCard 
                      proposal={proposal}
                      onVote={onVote}
                      isConnected={isWalletConnected}
                    />
                  </div>
                ))}
              </div>
            )}
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