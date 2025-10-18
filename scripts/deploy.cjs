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
      title: "Increase Development Fund Allocation",
      description: "Proposal to allocate an additional 500,000 tokens to the development fund for Q2 2024 roadmap execution and ecosystem growth initiatives.",
      duration: 7 * 24 * 60 * 60, // 7 days in seconds
      quorumThreshold: 100,
      category: "treasury",
      priority: "high",
      tags: "funding, development, roadmap",
      votingOptions: "yes_no_abstain",
      proposalHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      chainId: 11155111
    },
    {
      title: "Implement Quarterly Governance Reviews", 
      description: "Establish regular governance review sessions to assess DAO performance, member engagement, and process improvements.",
      duration: 10 * 24 * 60 * 60, // 10 days in seconds
      quorumThreshold: 150,
      category: "governance",
      priority: "medium",
      tags: "governance, process, review",
      votingOptions: "yes_no_abstain",
      proposalHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
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
  
  // Update contract address in contractConfig.ts
  const contractConfigPath = path.join(__dirname, "../src/lib/contractConfig.ts");
  let contractConfigContent = fs.readFileSync(contractConfigPath, "utf8");
  contractConfigContent = contractConfigContent.replace(
    /CONTRACT_ADDRESS = "0x[^"]*"/,
    `CONTRACT_ADDRESS = "${contractAddress}"`
  );
  fs.writeFileSync(contractConfigPath, contractConfigContent);
  
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
