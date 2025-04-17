import { DEFAULT_CHAIN } from "./chains";

import arbitrumSepoliaDevnet from "@kleros/kleros-v2-contracts/deployments/arbitrumSepoliaDevnet";
import arbitrum from "@kleros/kleros-v2-contracts/deployments/arbitrum";

const deploymentsByChainId: Record<number, any> = {
  421614: arbitrumSepoliaDevnet,
  42161: arbitrum,
};

export const KLEROS_CORE_ADDRESS = deploymentsByChainId[DEFAULT_CHAIN].contracts.KlerosCore.address;
