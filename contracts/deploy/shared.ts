import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HomeChains } from "./utils";
import { EscrowUniversal } from "../typechain-types";
import { getArbitratorContracts } from "./utils/getContracts";

export type EscrowDeployment = {
  escrow: string;
  view: string;
};

export type EscrowDeployments = {
  universal: EscrowDeployment;
  customBuyer?: EscrowDeployment;
};

export const config = {
  arbitrumSepoliaDevnet: {
    feeTimeout: 600, // 10 minutes
    settlementTimeout: 600, // 10 minutes
    jurors: 1,
    courtId: 1,
    escrowDeployments: {
      universal: {
        escrow: "EscrowUniversal",
        view: "EscrowView",
      },
      customBuyer: {
        escrow: "EscrowCustomBuyer",
        view: "EscrowViewCustomBuyer",
      },
    } satisfies EscrowDeployments,
  },
  arbitrum: {
    feeTimeout: 302400, // 84 hours
    settlementTimeout: 172800, // 48 hours
    jurors: 3,
    courtId: 1,
    escrowDeployments: {
      universal: {
        escrow: "EscrowUniversal",
        view: "EscrowView",
      },
      customBuyer: undefined,
    } satisfies EscrowDeployments,
  },
};

const deployEscrow = async (
  hre: HardhatRuntimeEnvironment,
  escrowDeployment: keyof EscrowDeployments
) => {
  const { deployments, getNamedAccounts, getChainId, ethers, network } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to %s with deployer %s", HomeChains[chainId], deployer);

  const { disputeTemplateRegistry, klerosCore } = await getArbitratorContracts(hre);
  const { feeTimeout, settlementTimeout, jurors, courtId, escrowDeployments } = config[network.name];
  const extraData = ethers.AbiCoder.defaultAbiCoder().encode(["uint96", "uint96"], [courtId, jurors]);

  await deploy(escrowDeployments[escrowDeployment].escrow, {
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
  const escrow = (await ethers.getContract(escrowDeployments[escrowDeployment].escrow)) as EscrowUniversal;
  const WETH = await deployments.get("WETH");
  const DAI = await deployments.get("DAI");
  const PNK = await deployments.getOrNull("PNK");
  const USDC = await deployments.getOrNull("USDC");
  const USDCe = await deployments.getOrNull("USDCe"); // USDC.e (Bridged USDC)
  const caps = {
    [ethers.ZeroAddress]: ethers.parseUnits("0.3"),
    [WETH.address]: ethers.parseUnits("0.3"),
    [DAI.address]: ethers.parseUnits("1000"),
  };
  if (PNK) {
    caps[PNK.address] = ethers.parseUnits("100000"); // 100,000 PNK
  }
  if (USDC) {
    caps[USDC.address] = ethers.parseUnits("1000", 6);
  }
  if (USDCe) {
    caps[USDCe.address] = ethers.parseUnits("1000", 6);
  }
  for (const [token, cap] of Object.entries(caps)) {
    console.log("Setting cap for", token, cap);
    await escrow.changeAmountCap(token, cap);
  }

  await deploy(escrowDeployments[escrowDeployment].view, {
    contract: "EscrowView",
    from: deployer,
    args: [escrow.target],
    gasLimit: 30000000,
    log: true,
  });
};

export default deployEscrow;
