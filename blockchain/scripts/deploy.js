const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting ParkWise contract deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy ParkWiseDonations contract
  console.log("📦 Deploying ParkWiseDonations...");
  const ParkWiseDonations = await hre.ethers.getContractFactory("ParkWiseDonations");
  const parkWise = await ParkWiseDonations.deploy();
  await parkWise.waitForDeployment();
  const parkWiseAddress = await parkWise.getAddress();
  
  console.log("✅ ParkWiseDonations deployed to:", parkWiseAddress);

  // Deploy EcoToken contract
  console.log("\n📦 Deploying EcoToken...");
  const EcoToken = await hre.ethers.getContractFactory("EcoToken");
  const ecoToken = await EcoToken.deploy();
  await ecoToken.waitForDeployment();
  const ecoTokenAddress = await ecoToken.getAddress();
  
  console.log("✅ EcoToken deployed to:", ecoTokenAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ParkWiseDonations: {
        address: parkWiseAddress,
        blockNumber: (await hre.ethers.provider.getBlockNumber()).toString(),
      },
      EcoToken: {
        address: ecoTokenAddress,
        blockNumber: (await hre.ethers.provider.getBlockNumber()).toString(),
      },
    },
  };

  // Save to JSON file
  const deploymentPath = `./deployments/${hre.network.name}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n💾 Deployment info saved to:", deploymentPath);

  // Save ABIs
  const parkWiseABI = JSON.parse(
    fs.readFileSync("./artifacts/contracts/ParkWiseDonations.sol/ParkWiseDonations.json")
  ).abi;
  
  const ecoTokenABI = JSON.parse(
    fs.readFileSync("./artifacts/contracts/EcoToken.sol/EcoToken.json")
  ).abi;

  fs.mkdirSync("./abi", { recursive: true });
  fs.writeFileSync(
    "./abi/ParkWiseDonations.json",
    JSON.stringify({ abi: parkWiseABI }, null, 2)
  );
  fs.writeFileSync(
    "./abi/EcoToken.json",
    JSON.stringify({ abi: ecoTokenABI }, null, 2)
  );

  console.log("💾 ABIs saved to ./abi/\n");

  // Setup initial configuration
  console.log("⚙️  Setting up initial configuration...");
  
  // Add deployer as verifier
  const tx1 = await parkWise.addVerifier(deployer.address);
  await tx1.wait();
  console.log("✅ Added deployer as verifier");

  // Add deployer as NGO
  const tx2 = await parkWise.addNGO(deployer.address);
  await tx2.wait();
  console.log("✅ Added deployer as NGO");

  // Create demo project
  const tx3 = await parkWise.createProject(
    "Amazon Rainforest Conservation",
    "Protect 1000 hectares of Amazon rainforest",
    hre.ethers.parseEther("10"), // 10 ETH funding goal
    30 * 24 * 60 * 60, // 30 days
    -3465300, // Latitude * 1e6 (Amazon)
    -62215900, // Longitude * 1e6
    10000 // 10km geofence
  );
  await tx3.wait();
  console.log("✅ Created demo project: Amazon Rainforest Conservation\n");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("📋 Verify contracts with:\n");
    console.log(`npx hardhat verify --network ${hre.network.name} ${parkWiseAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${ecoTokenAddress}\n`);
  }

  console.log("✨ Deployment complete!\n");
  console.log("📄 Summary:");
  console.log("├─ Network:", hre.network.name);
  console.log("├─ ParkWiseDonations:", parkWiseAddress);
  console.log("└─ EcoToken:", ecoTokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
