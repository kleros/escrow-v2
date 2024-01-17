/* eslint-disable node/no-missing-require */
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
// import "hardhat-deploy-tenderly";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
// import "hardhat-watcher";
// import "hardhat-docgen";
// import "hardhat-contract-sizer";
// import "hardhat-tracer";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
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
      live: false,
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
    mainnetFork: {
      chainId: 1,
      url: `http://127.0.0.1:8545`,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      },
      accounts: process.env.MAINNET_PRIVATE_KEY !== undefined ? [process.env.MAINNET_PRIVATE_KEY] : [],
      live: false,
      saveDeployments: false,
      tags: ["test", "local"],
    },
    arbitrumSepoliaFork: {
      chainId: 421614,
      url: `http://127.0.0.1:8545`,
      forking: {
        url: process.env.ARBITRUM_SEPOLIA_RPC ?? "https://sepolia-rollup.arbitrum.io/rpc",
      },
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
    },

    // Home chain ---------------------------------------------------------------------------------
    arbitrumSepolia: {
      chainId: 421614,
      url: process.env.ARBITRUM_SEPOLIA_RPC ?? "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
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
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
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
      url: "https://arb1.arbitrum.io/rpc",
      accounts: process.env.MAINNET_PRIVATE_KEY !== undefined ? [process.env.MAINNET_PRIVATE_KEY] : [],
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
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      live: true,
      saveDeployments: true,
      tags: ["staging", "foreign", "layer1"],
    },
    sepoliaDevnet: {
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      live: true,
      saveDeployments: true,
      tags: ["staging", "foreign", "layer1"],
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.MAINNET_PRIVATE_KEY !== undefined ? [process.env.MAINNET_PRIVATE_KEY] : [],
      live: true,
      saveDeployments: true,
      tags: ["production", "foreign", "layer1"],
    },
    gnosischain: {
      chainId: 100,
      url: `https://rpc.gnosis.gateway.fm`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
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
    relayer: {
      default: 1,
    },
    bridger: {
      default: 2,
    },
    challenger: {
      default: 3,
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
  tenderly: {
    project: process.env.TENDERLY_PROJECT !== undefined ? process.env.TENDERLY_PROJECT : "kleros-v2",
    username: process.env.TENDERLY_USERNAME !== undefined ? process.env.TENDERLY_USERNAME : "",
  },
  external: {
    // https://github.com/wighawag/hardhat-deploy#importing-deployment-from-other-projects-with-truffle-support
    deployments: {
      arbitrumSepolia: ["../node_modules/@kleros/kleros-v2-contracts/deployments/arbitrumSepolia"],
      arbitrumSepoliaDevnet: ["../node_modules/@kleros/kleros-v2-contracts/deployments/arbitrumSepolia"],
      arbitrum: ["../node_modules/@kleros/kleros-v2-contracts/deployments/arbitrum"],
    },
  },
};

export default config;
