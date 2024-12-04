import hre from "hardhat";
const { ethers } = hre;

// CONFIGURE THIS //
const contractAddress = "0xe31bf51fA6808CDe0B08095670f647097FdAC25B";
const initialSupply = ethers.parseEther("1000000000");
const name = "Test Lit Token";
const symbol = "tLit";
const newOwner = "0x50e2dac5e78B5905CB09495547452cEE64426db2";

async function run() {
  const contract = await ethers.getContractAt("LitToken", contractAddress);
  const tx = await contract.initialize(
    initialSupply,
    name,
    symbol,
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    newOwner,
    {
      gasLimit: 1_000_000,
    }
  );
  console.info(`tx hash for initialize: ${tx.hash}`);
  await tx.wait();
  console.info("done");

  // send tokens to new owner
  const tx2 = await contract.transfer(newOwner, initialSupply);
  console.info(`tx hash for transfer: ${tx2.hash}`);
  await tx2.wait();
  console.info("done");
}

run();
