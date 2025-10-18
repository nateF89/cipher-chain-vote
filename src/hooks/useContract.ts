import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contractConfig';

export function useCipherChainVote() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract: writeContractCreate } = useWriteContract();
  const { writeContract: writeContractVote } = useWriteContract();
  const { data: proposalInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getProposalInfo',
  });

  const handleCreateProposal = async (
    title: string,
    description: string,
    proposalHash: string,
    duration: number,
    chainId: number
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContractCreate({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createProposal',
        args: [title, description, proposalHash, duration, chainId],
      });
      
      console.log('Proposal created successfully');
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCastVote = async (
    proposalId: number,
    voteChoice: number,
    votingPower: number
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContractVote({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'castVote',
        args: [proposalId, voteChoice, votingPower],
      });
      
      console.log('Vote cast successfully');
    } catch (err) {
      console.error('Error casting vote:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const getProposal = async (proposalId: number) => {
    try {
      // In a real implementation, you would use useReadContract with the proposalId
      return proposalInfo;
    } catch (err) {
      console.error('Error getting proposal:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  return {
    createProposal: handleCreateProposal,
    castVote: handleCastVote,
    getProposal,
    isLoading,
    error,
    isConnected: !!address,
    address,
  };
}
