import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  disputeTemplateRegistryConfig as devnetDtrConfig,
  klerosCoreConfig as devnetCoreConfig,
} from "@kleros/kleros-v2-contracts/deployments/devnet.viem";
import {
  disputeTemplateRegistryConfig as mainnetDtrConfig,
  klerosCoreNeoConfig as mainnetCoreConfig,
} from "@kleros/kleros-v2-contracts/deployments/mainnet.viem";
import {
  KlerosCore,
  DisputeTemplateRegistry__factory,
  KlerosCore__factory,
  KlerosCoreNeo__factory,
  KlerosCoreNeo,
  DisputeTemplateRegistry,
} from "@kleros/kleros-v2-contracts/typechain-types";
import { EscrowView, EscrowUniversal } from "../../typechain-types";

export const getContracts = async (hre: HardhatRuntimeEnvironment) => {
  const { getChainId, ethers, config } = hre;
  const chainId = Number(await getChainId());
  const escrow = await ethers.getContract<EscrowUniversal>("EscrowUniversal");
  const view = await ethers.getContract<EscrowView>("EscrowView");
  let disputeTemplateRegistry: DisputeTemplateRegistry;
  let klerosCore: KlerosCore | KlerosCoreNeo;
  switch (chainId) {
    case config.networks.arbitrum.chainId:
      disputeTemplateRegistry = DisputeTemplateRegistry__factory.connect(
        mainnetDtrConfig.address[chainId],
        ethers.provider
      );
      klerosCore = KlerosCoreNeo__factory.connect(mainnetCoreConfig.address[chainId], ethers.provider);
      break;
    case config.networks.arbitrumSepolia.chainId:
      disputeTemplateRegistry = DisputeTemplateRegistry__factory.connect(
        devnetDtrConfig.address[chainId],
        ethers.provider
      );
      klerosCore = KlerosCore__factory.connect(devnetCoreConfig.address[chainId], ethers.provider);
      break;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
  return { escrow, view, disputeTemplateRegistry, klerosCore };
};
