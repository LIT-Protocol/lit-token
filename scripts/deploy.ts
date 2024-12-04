import hre from "hardhat";
import { spawnSync } from "child_process";
const { ethers } = hre;

// mint 100m tokens initially
const tokensToMint = ethers.parseEther("100000000");
const newOwner = "0x50e2dac5e78B5905CB09495547452cEE64426db2";

async function run() {
  const contract = await ethers.deployContract("LitToken");
  const deploymentTransaction = contract.deploymentTransaction();
  console.info(`deploy tx hash: ${deploymentTransaction!.hash}`);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.info(`deployed to ${contractAddress}`);

  // mint tokens to new initial token holder
  const tx = await contract.mint(newOwner, tokensToMint);
  console.info(
    `tx hash for minting ${ethers.formatEther(
      tokensToMint
    )} tokens to ${newOwner}: ${tx.hash}`
  );
  await tx.wait();
  console.info("done");

  // set new owner
  const setOwnerTx = await contract.transferOwnership(newOwner);
  console.info(`tx hash for setting new owner ${newOwner}: ${setOwnerTx.hash}`);
  await setOwnerTx.wait();
  console.info("done");

  // verify
  console.info(
    `Verifying contract ${contractAddress} on chain ${hre.network.name}`
  );
  const result = spawnSync(
    "npx",
    [
      "hardhat",
      "verify",
      "--network",
      hre.network.name,
      contractAddress,
      "--contract",
      "contracts/LitToken.sol:LitToken",
    ],
    {
      stdio: "inherit",
    }
  );
  if (result.stdout) {
    console.log(result.stdout.toString());
  }
  if (result.stderr) {
    console.error(result.stderr.toString());
  }
}

run();
