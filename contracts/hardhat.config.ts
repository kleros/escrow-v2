/* eslint-disable node/no-missing-require */
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-watcher";
import "hardhat-docgen";
// import "hardhat-contract-sizer"; // prevents hardhat-deploy from finding chalk...
// import "hardhat-tracer"; // prevents hardhat-deploy from finding chalk...
require("./scripts/setDisputeTemplate");
require("./scripts/getPayoutMessages");

dotenv.config();

const sellerAccount = process.env.PRIVATE_KEY_SELLER ? [process.env.PRIVATE_KEY_SELLER] : [];
const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY, ...sellerAccount] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  paths: {
    sources: "./src",
    cache: "./cache_hardhat",
  },
  networks: {
    hardhat: {
      // hardhat-deploy cannot run a fork on a non-harhat network
      // cf. https://github.com/nomiclabs/hardhat/issues/1139 and https://github.com/wighawag/hardhat-deploy/issues/63
      forking: process.env.HARDHAT_FORK
        ? {
            url: process.env.ARBITRUM_SEPOLIA_RPC ?? "https://sepolia-rollup.arbitrum.io/rpc",
          }
        : undefined,
      saveDeployments: true,
      allowUnlimitedContractSize: true,
      tags: ["test", "local"],
    },
    localhost: {
      url: `http://127.0.0.1:8545`,
      chainId: 31337,
      saveDeployments: true,
      tags: ["test", "local"],
    },
    dockerhost: {
      url: `http://host.docker.internal:8545`,
      chainId: 31337,
      saveDeployments: true,
      tags: ["test", "local"],
    },

    // Home chain ---------------------------------------------------------------------------------
    arbitrumSepolia: {
      chainId: 421614,
      url: process.env.ARBITRUM_SEPOLIA_RPC ?? "https://sepolia-rollup.arbitrum.io/rpc",
      accounts,
      live: true,
      saveDeployments: true,
      tags: ["staging", "home", "layer2"],
      verify: {
        etherscan: {
          apiUrl: "https://api-sepolia.arbiscan.io",
          apiKey: process.env.ARBISCAN_API_KEY,
        },
      },
    },
    arbitrumSepoliaDevnet: {
      chainId: 421614,
      url: process.env.ARBITRUM_SEPOLIA_RPC ?? "https://sepolia-rollup.arbitrum.io/rpc",
      accounts,
      live: true,
      saveDeployments: true,
      tags: ["staging", "home", "layer2"],
      verify: {
        etherscan: {
          apiUrl: "https://api-sepolia.arbiscan.io",
          apiKey: process.env.ARBISCAN_API_KEY,
        },
      },
    },
    arbitrum: {
      chainId: 42161,
      url: process.env.ARBITRUM_RPC ?? `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      live: true,
      saveDeployments: true,
      tags: ["production", "home", "layer2"],
      verify: {
        etherscan: {
          apiKey: process.env.ARBISCAN_API_KEY,
        },
      },
    },
    // Foreign chain ---------------------------------------------------------------------------------
    sepolia: {
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      live: true,
      saveDeployments: true,
      tags: ["staging", "foreign", "layer1"],
    },
    sepoliaDevnet: {
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      live: true,
      saveDeployments: true,
      tags: ["staging", "foreign", "layer1"],
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      live: true,
      saveDeployments: true,
      tags: ["production", "foreign", "layer1"],
    },
    gnosischain: {
      chainId: 100,
      url: `https://rpc.gnosis.gateway.fm`,
      accounts,
      live: true,
      saveDeployments: true,
      tags: ["production", "foreign", "layer1"],
      verify: {
        etherscan: {
          apiKey: process.env.GNOSISSCAN_API_KEY,
        },
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    seller: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined ? process.env.REPORT_GAS === "true" : false,
    currency: "USD",
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY_FIX,
    },
  },
  watcher: {
    compilation: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
    testArbitration: {
      tasks: [
        { command: "compile", params: { quiet: true } },
        {
          command: "test",
          params: {
            noCompile: true,
            testFiles: ["./test/arbitration/index.ts"],
          },
        },
      ],
      files: ["./test/**/*", "./src/**/*"],
    },
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: false,
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;
