import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      ...(process.env["LIT_SEPOLIA_DEPLOYER_PRIVATE_KEY"] && {
        accounts: [process.env["LIT_SEPOLIA_DEPLOYER_PRIVATE_KEY"]],
      }),
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.LIT_ETHERSCAN_API_KEY!,
    },
  },
};

export default config;
