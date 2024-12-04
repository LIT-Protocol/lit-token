import hre from "hardhat";
import { spawnSync } from "child_process";
import fs from "fs";
import { jsonStringify } from "./utils";
const { ethers } = hre;
import fsSync from "fs";

const fs = fsSync.promises;

// CONFIGURE THIS //
const args: any[] = [18, "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766"];

async function run() {
  const contract = await ethers.deployContract("LitToken", args);
  const deploymentTransaction = contract.deploymentTransaction();
  console.info(`deploy tx hash: ${deploymentTransaction!.hash}`);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.info(`deployed to ${contractAddress}`);

  // verify
  console.info(
    `Verifying contract ${contractAddress} on chain ${hre.network.name}`
  );
  // write arguments to file
  // generate a random string
  const randomFilename = Math.random().toString(36).substring(7);
  const argsFileName = `/tmp/${randomFilename}.js`;
  const template = `module.exports = ${jsonStringify(args)}`;
  await fs.writeFile(argsFileName, template);
  spawnSync(
    "npx",
    [
      "hardhat",
      "verify",
      "--network",
      hre.network.name,
      `--constructor-args ${argsFileName}`,
      contractAddress,
      "--contract",
      "contracts/LitToken.sol:LitToken",
    ],
    {
      stdio: "pipe",
    }
  );
}

run();
