import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeploymentName, getContractsEthers as _getArbitratorContracts } from "@kleros/kleros-v2-contracts";
import { EscrowView, EscrowUniversal } from "../../typechain-types";

const NETWORK_TO_DEPLOYMENT: Record<string, DeploymentName> = {
  arbitrumSepoliaDevnet: "devnet",
  arbitrumSepolia: "testnet",
  arbitrum: "mainnetNeo",
} as const;

export const getArbitratorContracts = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers, deployments } = hre;
  const networkName = deployments.getNetworkName();
  const deploymentName = NETWORK_TO_DEPLOYMENT[networkName];
  if (!deploymentName)
    throw new Error(
      `Unsupported network: ${networkName}. Supported networks: ${Object.keys(NETWORK_TO_DEPLOYMENT).join(", ")}`
    );
  return await _getArbitratorContracts(ethers.provider, deploymentName);
};

export const getContracts = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers } = hre;
  const { klerosCore, disputeTemplateRegistry } = await getArbitratorContracts(hre);
  const escrow = await ethers.getContract<EscrowUniversal>("EscrowUniversal");
  const view = await ethers.getContract<EscrowView>("EscrowView");
  return { escrow, view, disputeTemplateRegistry, klerosCore };
};
