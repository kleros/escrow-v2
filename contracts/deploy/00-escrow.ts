import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";
import { EscrowUniversal } from "../typechain-types";
import { getContracts } from "./utils/getContracts";

const config = {
  arbitrumSepoliaDevnet: {
    feeTimeout: 600, // 10 minutes
    settlementTimeout: 600, // 10 minutes
    jurors: 1,
    courtId: 1,
  },
  arbitrum: {
    feeTimeout: 302400, // 84 hours
    settlementTimeout: 172800, // 48 hours
    jurors: 3,
    courtId: 1,
  },
};

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId, ethers, network } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to %s with deployer %s", HomeChains[chainId], deployer);

  const { disputeTemplateRegistry, klerosCore } = await getContracts(hre);
  const { feeTimeout, settlementTimeout, jurors, courtId } = config[network.name];
  const extraData = ethers.AbiCoder.defaultAbiCoder().encode(["uint96", "uint96"], [courtId, jurors]);

  await deploy("EscrowUniversal", {
    from: deployer,
    args: [
      klerosCore.target,
      extraData,
      "", // configured in the next step by setDisputeTemplate
      "", // configured in the next step by setDisputeTemplate
      disputeTemplateRegistry.target,
      feeTimeout,
      settlementTimeout,
    ],
    log: true,
  });

  // Set the value cap to about USD 1000
  const escrow = (await ethers.getContract("EscrowUniversal")) as EscrowUniversal;
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

  await deploy("EscrowView", {
    from: deployer,
    args: [escrow.target],
    gasLimit: 50000000,
    log: true,
  });
};

deploy.tags = ["Escrow"];
deploy.skip = async ({ network }) => {
  return isSkipped(network, !HomeChains[network.config.chainId ?? 0]);
};

export default deploy;
