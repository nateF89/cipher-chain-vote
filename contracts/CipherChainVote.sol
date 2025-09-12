// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CipherChainVote is SepoliaConfig {
    using FHE for *;
    
    struct Proposal {
        euint32 proposalId;
        euint32 votesFor;
        euint32 votesAgainst;
        euint32 totalVotes;
        euint8 status; // 0: pending, 1: active, 2: passed, 3: rejected
        bool isActive;
        bool isVerified;
        string title;
        string description;
        string proposalHash;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        uint256 chainId;
    }
    
    struct Vote {
        euint32 voteId;
        euint32 proposalId;
        euint8 voteChoice; // 0: against, 1: for
        euint32 votingPower;
        address voter;
        uint256 timestamp;
        bool isEncrypted;
    }
    
    struct Voter {
        euint32 votingPower;
        euint32 reputation;
        bool isRegistered;
        bool hasVoted;
        address voterAddress;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Vote) public votes;
    mapping(address => Voter) public voters;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    uint256 public proposalCounter;
    uint256 public voteCounter;
    
    address public owner;
    address public verifier;
    euint32 public totalVotingPower;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed voteId, uint256 indexed proposalId, address indexed voter);
    event ProposalStatusChanged(uint256 indexed proposalId, uint8 status);
    event VoterRegistered(address indexed voter, uint32 votingPower);
    event CrossChainVoteAggregated(uint256 indexed proposalId, uint32 totalVotes);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    function createProposal(
        string memory _title,
        string memory _description,
        string memory _proposalHash,
        uint256 _duration,
        uint256 _chainId
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(voters[msg.sender].isRegistered, "Voter must be registered");
        
        uint256 proposalId = proposalCounter++;
        
        proposals[proposalId] = Proposal({
            proposalId: FHE.asEuint32(0), // Will be set properly later
            votesFor: FHE.asEuint32(0),
            votesAgainst: FHE.asEuint32(0),
            totalVotes: FHE.asEuint32(0),
            status: FHE.asEuint8(0), // pending
            isActive: true,
            isVerified: false,
            title: _title,
            description: _description,
            proposalHash: _proposalHash,
            proposer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            chainId: _chainId
        });
        
        emit ProposalCreated(proposalId, msg.sender, _title);
        return proposalId;
    }
    
    function castVote(
        uint256 proposalId,
        externalEuint32 voteChoice,
        externalEuint32 votingPower,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        require(proposals[proposalId].isActive, "Proposal is not active");
        require(block.timestamp >= proposals[proposalId].startTime, "Voting has not started");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting has ended");
        require(voters[msg.sender].isRegistered, "Voter must be registered");
        require(!hasVoted[proposalId][msg.sender], "Already voted on this proposal");
        
        uint256 voteId = voteCounter++;
        
        // Convert external values to internal FHE values
        euint32 internalVoteChoice = FHE.fromExternal(voteChoice, inputProof);
        euint32 internalVotingPower = FHE.fromExternal(votingPower, inputProof);
        
        votes[voteId] = Vote({
            voteId: FHE.asEuint32(0), // Will be set properly later
            proposalId: FHE.asEuint32(0), // Will be set to actual value
            voteChoice: FHE.asEuint8(0), // Will be set from internalVoteChoice
            votingPower: internalVotingPower,
            voter: msg.sender,
            timestamp: block.timestamp,
            isEncrypted: true
        });
        
        // Update proposal totals
        proposals[proposalId].totalVotes = FHE.add(proposals[proposalId].totalVotes, internalVotingPower);
        
        // Update vote counts based on choice
        ebool isForVote = FHE.eq(internalVoteChoice, FHE.asEuint32(1));
        proposals[proposalId].votesFor = FHE.select(
            isForVote,
            FHE.add(proposals[proposalId].votesFor, internalVotingPower),
            proposals[proposalId].votesFor
        );
        
        proposals[proposalId].votesAgainst = FHE.select(
            isForVote,
            proposals[proposalId].votesAgainst,
            FHE.add(proposals[proposalId].votesAgainst, internalVotingPower)
        );
        
        hasVoted[proposalId][msg.sender] = true;
        voters[msg.sender].hasVoted = true;
        
        emit VoteCast(voteId, proposalId, msg.sender);
        return voteId;
    }
    
    function registerVoter(
        address voter,
        externalEuint32 votingPower,
        bytes calldata inputProof
    ) public onlyVerifier {
        require(voter != address(0), "Invalid voter address");
        require(!voters[voter].isRegistered, "Voter already registered");
        
        euint32 internalVotingPower = FHE.fromExternal(votingPower, inputProof);
        
        voters[voter] = Voter({
            votingPower: internalVotingPower,
            reputation: FHE.asEuint32(100), // Default reputation
            isRegistered: true,
            hasVoted: false,
            voterAddress: voter
        });
        
        totalVotingPower = FHE.add(totalVotingPower, internalVotingPower);
        
        emit VoterRegistered(voter, 0); // FHE.decrypt(internalVotingPower) - will be decrypted off-chain
    }
    
    function updateVoterReputation(
        address voter,
        externalEuint32 newReputation,
        bytes calldata inputProof
    ) public onlyVerifier {
        require(voters[voter].isRegistered, "Voter not registered");
        
        euint32 internalReputation = FHE.fromExternal(newReputation, inputProof);
        voters[voter].reputation = internalReputation;
    }
    
    function verifyProposal(uint256 proposalId, bool isVerified) public onlyVerifier {
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        
        proposals[proposalId].isVerified = isVerified;
        if (isVerified) {
            proposals[proposalId].status = FHE.asEuint8(1); // active
        }
        
        emit ProposalStatusChanged(proposalId, isVerified ? 1 : 0);
    }
    
    function finalizeProposal(uint256 proposalId) public {
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        require(block.timestamp > proposals[proposalId].endTime, "Voting period not ended");
        require(proposals[proposalId].isActive, "Proposal already finalized");
        
        proposals[proposalId].isActive = false;
        
        // In a real implementation, you would decrypt and compare votes
        // For now, we'll set a default status
        proposals[proposalId].status = FHE.asEuint8(2); // passed
        
        emit ProposalStatusChanged(proposalId, 2);
    }
    
    function aggregateCrossChainVotes(
        uint256 proposalId,
        externalEuint32 crossChainVotes,
        bytes calldata inputProof
    ) public onlyVerifier {
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        
        euint32 internalCrossChainVotes = FHE.fromExternal(crossChainVotes, inputProof);
        proposals[proposalId].totalVotes = FHE.add(proposals[proposalId].totalVotes, internalCrossChainVotes);
        
        emit CrossChainVoteAggregated(proposalId, 0); // FHE.decrypt(internalCrossChainVotes) - will be decrypted off-chain
    }
    
    function getProposalInfo(uint256 proposalId) public view returns (
        string memory title,
        string memory description,
        string memory proposalHash,
        uint8 status,
        bool isActive,
        bool isVerified,
        address proposer,
        uint256 startTime,
        uint256 endTime,
        uint256 chainId
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.title,
            proposal.description,
            proposal.proposalHash,
            0, // FHE.decrypt(proposal.status) - will be decrypted off-chain
            proposal.isActive,
            proposal.isVerified,
            proposal.proposer,
            proposal.startTime,
            proposal.endTime,
            proposal.chainId
        );
    }
    
    function getVoteInfo(uint256 voteId) public view returns (
        uint8 voteChoice,
        uint8 votingPower,
        address voter,
        uint256 timestamp,
        bool isEncrypted
    ) {
        Vote storage vote = votes[voteId];
        return (
            0, // FHE.decrypt(vote.voteChoice) - will be decrypted off-chain
            0, // FHE.decrypt(vote.votingPower) - will be decrypted off-chain
            vote.voter,
            vote.timestamp,
            vote.isEncrypted
        );
    }
    
    function getVoterInfo(address voter) public view returns (
        uint8 votingPower,
        uint8 reputation,
        bool isRegistered,
        bool hasVoted
    ) {
        Voter storage voterInfo = voters[voter];
        return (
            0, // FHE.decrypt(voterInfo.votingPower) - will be decrypted off-chain
            0, // FHE.decrypt(voterInfo.reputation) - will be decrypted off-chain
            voterInfo.isRegistered,
            voterInfo.hasVoted
        );
    }
    
    function getProposalVoteCounts(uint256 proposalId) public view returns (
        uint8 votesFor,
        uint8 votesAgainst,
        uint8 totalVotes
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            0, // FHE.decrypt(proposal.votesFor) - will be decrypted off-chain
            0, // FHE.decrypt(proposal.votesAgainst) - will be decrypted off-chain
            0  // FHE.decrypt(proposal.totalVotes) - will be decrypted off-chain
        );
    }
}
