import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useAccount } from "wagmi";
import Index from "./pages/Index";
import Proposals from "./pages/Proposals";
import NotFound from "./pages/NotFound";
import { VotingModal } from "./components/VotingModal";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

function App() {
  const { isConnected, address } = useAccount();
  const [selectedChain, setSelectedChain] = useState("sepolia");
  const [votingModalOpen, setVotingModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<string>("");

  const handleVote = (proposalId: string) => {
    setSelectedProposal(proposalId);
    setVotingModalOpen(true);
  };

  const handleSubmitVote = (vote: "for" | "against", reason?: string) => {
    console.log("Vote submitted:", { proposalId: selectedProposal, vote, reason });
    // In a real app, this would submit to the blockchain
  };

  // Mock proposal data for voting modal
  const mockProposals = [
    {
      id: "1",
      title: "Increase Cross-Chain Bridge Security",
      description: "Proposal to implement additional security measures for cross-chain asset transfers and governance communications.",
    },
    {
      id: "2", 
      title: "Multi-Chain Treasury Allocation",
      description: "Distribute treasury funds across multiple chains to support ecosystem growth and development initiatives.",
    },
    {
      id: "3",
      title: "Privacy Protocol Upgrade",
      description: "Upgrade to latest zero-knowledge proof system for enhanced voting privacy and ballot encryption.",
    }
  ];

  const selectedProposalData = mockProposals.find(p => p.id === selectedProposal);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route 
            path="/" 
            element={
              <Index 
                isWalletConnected={isConnected}
                walletAddress={address}
                selectedChain={selectedChain}
                onChainSelect={setSelectedChain}
                onVote={handleVote}
              />
            } 
          />
          <Route 
            path="/proposals" 
            element={
              <Proposals 
                isWalletConnected={isConnected}
                walletAddress={address}
                selectedChain={selectedChain}
                onChainSelect={setSelectedChain}
                onVote={handleVote}
              />
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Voting Modal */}
        <VotingModal 
          isOpen={votingModalOpen}
          onClose={() => setVotingModalOpen(false)}
          proposalId={selectedProposal}
          proposalTitle={selectedProposalData?.title || ""}
          onSubmitVote={handleSubmitVote}
        />

        <Toaster />
      </div>
    </Router>
  );
}

export default App;
