const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CipherChainVote contract...");

  // Get the contract factory
  const CipherChainVote = await ethers.getContractFactory("CipherChainVote");
  
  // Deploy the contract with a verifier address (use deployer as verifier for now)
  const [deployer] = await ethers.getSigners();
  const verifierAddress = deployer.address; // Use deployer as verifier for simplicity
  
  const cipherChainVote = await CipherChainVote.deploy(verifierAddress);
  
  await cipherChainVote.waitForDeployment();
  
  const contractAddress = await cipherChainVote.getAddress();
  
  console.log("CipherChainVote deployed to:", contractAddress);
  console.log("Verifier address:", verifierAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    verifierAddress,
    deploymentTime: new Date().toISOString(),
    network: "sepolia"
  };
  
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
