const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CipherChainVote contract...");

  // Get the contract factory
  const CipherChainVote = await ethers.getContractFactory("CipherChainVote");
  
  // Deploy the contract with a verifier address (use deployer as verifier for now)
  const [deployer] = await ethers.getSigners();
  const verifierAddress = deployer.address; // Use deployer as verifier for simplicity
  
  console.log("Deploying with verifier:", verifierAddress);
  
  const cipherChainVote = await CipherChainVote.deploy(verifierAddress);
  
  // Wait for deployment to complete
  await cipherChainVote.waitForDeployment();
  
  const contractAddress = await cipherChainVote.getAddress();
  
  console.log("CipherChainVote deployed to:", contractAddress);
  console.log("Contract address:", contractAddress);
  
  // Verify the deployment
  console.log("Verifying deployment...");
  const owner = await cipherChainVote.owner();
  const verifier = await cipherChainVote.verifier();
  console.log("Contract owner:", owner);
  console.log("Contract verifier:", verifier);
  
  // Test basic functionality
  console.log("Testing basic functionality...");
  const proposalCount = await cipherChainVote.getProposalCount();
  console.log("Initial proposal count:", proposalCount.toString());
  
  // Register the deployer as a voter
  console.log("Registering deployer as voter...");
  const registerTx = await cipherChainVote.registerVoter(deployer.address, true);
  await registerTx.wait();
  console.log("Deployer registered as voter");
  
  // Initialize demo proposals
  console.log("Creating demo proposals...");
  
  const demoProposals = [
    {
      title: "Increase Cross-Chain Bridge Security",
      description: "Proposal to implement additional security measures for cross-chain asset transfers and governance communications. This includes enhanced encryption protocols, multi-signature verification, and improved audit trails for all cross-chain operations.",
      duration: 7 * 24 * 60 * 60, // 7 days in seconds
      quorumThreshold: 100,
      category: "security",
      priority: "high",
      tags: "security, cross-chain, bridge, encryption",
      votingOptions: "yes_no_abstain",
      proposalHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      chainId: 11155111
    },
    {
      title: "Multi-Chain Treasury Allocation",
      description: "Distribute treasury funds across multiple chains to support ecosystem growth and development initiatives. This proposal aims to diversify our treasury holdings and support development across Ethereum, Polygon, and Arbitrum networks.",
      duration: 10 * 24 * 60 * 60, // 10 days in seconds
      quorumThreshold: 150,
      category: "treasury",
      priority: "high",
      tags: "treasury, multi-chain, allocation, development",
      votingOptions: "yes_no_abstain",
      proposalHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      chainId: 11155111
    },
    {
      title: "Privacy Protocol Upgrade",
      description: "Upgrade to latest zero-knowledge proof system for enhanced voting privacy and ballot encryption. This includes implementing state-of-the-art FHE (Fully Homomorphic Encryption) for complete vote privacy while maintaining verifiability.",
      duration: 14 * 24 * 60 * 60, // 14 days in seconds
      quorumThreshold: 200,
      category: "technical",
      priority: "medium",
      tags: "privacy, encryption, FHE, zero-knowledge, upgrade",
      votingOptions: "yes_no_abstain",
      proposalHash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
      chainId: 11155111
    }
  ];
  
  // Create demo proposals
  for (let i = 0; i < demoProposals.length; i++) {
    const proposal = demoProposals[i];
    try {
      console.log(`Creating proposal ${i + 1}: ${proposal.title}`);
      const createTx = await cipherChainVote.createProposal(
        proposal.title,
        proposal.description,
        proposal.duration,
        proposal.quorumThreshold,
        proposal.category,
        proposal.priority,
        proposal.tags,
        proposal.votingOptions,
        proposal.proposalHash,
        proposal.chainId
      );
      await createTx.wait();
      console.log(`✅ Proposal ${i + 1} created successfully`);
    } catch (error) {
      console.log(`⚠️  Failed to create proposal ${i + 1}:`, error.message);
    }
  }
  
  // Update contract address in frontend files
  console.log("📝 Updating contract address in frontend...");
  
  const fs = require('fs');
  const path = require('path');
  
  // Update contract address in contracts.ts
  const contractsConfigPath = path.join(__dirname, "../src/config/contracts.ts");
  let contractsConfigContent = fs.readFileSync(contractsConfigPath, "utf8");
  contractsConfigContent = contractsConfigContent.replace(
    /CIPHER_CHAIN_VOTE: "0x[^"]*"/,
    `CIPHER_CHAIN_VOTE: "${contractAddress}"`
  );
  fs.writeFileSync(contractsConfigPath, contractsConfigContent);
  
  console.log("✅ Contract address updated in frontend files");
  
  console.log("🎉 Deployment completed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Explorer: https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`📊 Demo Proposals Created: ${demoProposals.length}`);
  console.log("\n🚀 Next Steps:");
  console.log("1. Contract address has been automatically updated in frontend");
  console.log("2. Test the FHE encryption/decryption functionality");
  console.log("3. Create and cast encrypted votes");
  console.log("4. Test result decryption after voting ends");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
