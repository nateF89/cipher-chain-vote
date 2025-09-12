import { useContractRead, useContractWrite, useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useState } from 'react';

// Contract ABI - you would get this from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_verifier", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "proposer", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"}
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "voteId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"}
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_proposalHash", "type": "string"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"},
      {"internalType": "uint256", "name": "_chainId", "type": "uint256"}
    ],
    "name": "createProposal",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"internalType": "uint8", "name": "voteChoice", "type": "uint8"},
      {"internalType": "uint32", "name": "votingPower", "type": "uint32"}
    ],
    "name": "castVote",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "proposalId", "type": "uint256"}
    ],
    "name": "getProposalInfo",
    "outputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "proposalHash", "type": "string"},
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "address", "name": "proposer", "type": "address"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "uint256", "name": "chainId", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - you would get this from deployment
const CONTRACT_ADDRESS = "0x742d35Cc6232534B4C4567e2"; // Replace with actual deployed address

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
