import { type Config, type ContractConfig, defineConfig } from "@wagmi/cli";
import { react, actions } from "@wagmi/cli/plugins";
import { readdir, readFile } from "fs/promises";
import { parse, join } from "path";
import { Chain } from "wagmi/chains";
import dotenv from "dotenv";
import {
  arbitrumSepoliaDevnet as arbitratorDevnet,
  arbitrumSepolia as arbitratorTestnet,
  arbitrum as arbitratorMainnet,
} from "@kleros/kleros-v2-contracts/cjs/deployments";

dotenv.config();

type ArbitratorContracts = {
  default: {
    contracts: {
      KlerosCore: {
        address: `0x${string}`;
        abi: any[];
      };
    };
  };
};

const addArbitratorContract = ({
  results,
  chain,
  name,
  contract,
}: {
  results: ContractConfig[];
  chain: Chain;
  name: string;
  contract: { address: `0x${string}`; abi: any[] };
}) => {
  results.push({
    name,
    address: {
      [chain.id]: contract.address as `0x{string}`,
    },
    abi: contract.abi,
  });
};

const readArtifacts = async (
  viemChainName: string,
  hardhatChainName: string,
  arbitratorContracts: ArbitratorContracts
) => {
  const chains = await import("wagmi/chains");
  const chain = chains[viemChainName] as Chain;
  if (!chain) {
    throw new Error(`Viem chain ${viemChainName} not found`);
  }

  const directoryPath = `../contracts/deployments/${hardhatChainName}`;
  const files = await readdir(directoryPath);

  const results: ContractConfig[] = [];
  for (const file of files) {
    const { name, ext } = parse(file);
    if (ext === ".json") {
      const filePath = join(directoryPath, file);
      const fileContent = await readFile(filePath, "utf-8");
      const jsonContent = JSON.parse(fileContent);
      results.push({
        name,
        address: {
          [chain.id]: jsonContent.address as `0x{string}`,
        },
        abi: jsonContent.abi,
      });
    }
  }

  const { KlerosCore } = arbitratorContracts.default.contracts;
  const arbitratorContractConfigs = [{ name: "KlerosCore", contract: KlerosCore }];
  arbitratorContractConfigs.forEach(({ name, contract }) => addArbitratorContract({ results, chain, name, contract }));
  return results;
};

const getConfig = async (): Promise<Config> => {
  const deployment = process.env.REACT_APP_DEPLOYMENT ?? "devnet";

  let viemNetwork: string;
  let hardhatNetwork: string;
  let arbitratorContracts;
  switch (deployment) {
    case "devnet":
      viemNetwork = "arbitrumSepolia";
      hardhatNetwork = "arbitrumSepoliaDevnet";
      arbitratorContracts = arbitratorDevnet;
      break;
    case "testnet":
      viemNetwork = "arbitrumSepolia";
      hardhatNetwork = "arbitrumSepolia";
      arbitratorContracts = arbitratorTestnet;
      break;
    case "mainnet":
      viemNetwork = "arbitrum";
      hardhatNetwork = "arbitrum";
      arbitratorContracts = arbitratorMainnet;
      break;
    default:
      throw new Error(`Unknown deployment ${deployment}`);
  }

  const deploymentContracts = await readArtifacts(viemNetwork, hardhatNetwork, arbitratorContracts);

  return {
    out: "src/hooks/contracts/generated.ts",
    contracts: [...deploymentContracts],
    plugins: [react(), actions()],
  };
};

export default defineConfig(getConfig);
