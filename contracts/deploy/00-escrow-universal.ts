import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";
import deployEscrow from "./shared";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  await deployEscrow(hre, "universal");
};

deploy.tags = ["EscrowUniversal"];
deploy.skip = async ({ network }) => {
  return isSkipped(network, !HomeChains[network.config.chainId ?? 0]);
};

export default deploy;
