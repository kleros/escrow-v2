import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId, ethers } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to %s with deployer %s", HomeChains[chainId], deployer);

  const klerosCore = await deployments.get("KlerosCore");
  const disputeTemplateRegistry = await deployments.get("DisputeTemplateRegistry");
  const feeTimeout = 600; // 10 minutes
  const settlementTimeout = 600; // 10 minutes
  
  // General court, 3 jurors
  const extraData = ethers.AbiCoder.defaultAbiCoder().encode(["uint96", "uint96"], [1, 3]);

  await deploy("EscrowUniversal", {
    from: deployer,
    args: [
      klerosCore.address,
      extraData,
      "", // configured in the next step by setDisputeTemplate
      "", // configured in the next step by setDisputeTemplate
      disputeTemplateRegistry.address,
      feeTimeout,
      settlementTimeout,
    ],
    log: true,
  });

  // Set the value cap to about USD 1000
  const escrow = await deployments.get("EscrowUniversal");
  const WETH = await deployments.get("WETH");
  const DAI = await deployments.get("DAI");
  const caps = {
    [ethers.ZeroAddress]: ethers.parseUnits("0.3"),
    [WETH.address]: ethers.parseUnits("0.3"),
    [DAI.address]: ethers.parseUnits("1000"),
  };
  for (const [token, cap] of Object.entries(caps)) {
    console.log("Setting cap for", token, cap);
    await escrow.changeAmountCap(token, cap);
  }
};

deploy.tags = ["Escrow"];
deploy.skip = async ({ network }) => {
  return isSkipped(network, !HomeChains[network.config.chainId ?? 0]);
};

export default deploy;
