// import { BigNumber, utils } from "ethers";
import { task } from "hardhat/config";
import { getContracts } from "../deploy/utils/getContracts";

const parameters = {
  arbitrumSepoliaDevnet: {},
  arbitrumSepoliaTestnet: {},
  arbitrum: {},
};

task("change-arbitrator", "Changes the arbitrator").setAction(async (args, hre) => {
  const { escrow, klerosCore } = await getContracts(hre);

  console.log("changing Arbitrator...");
  const tx = await escrow.changeArbitrator(klerosCore.target);
  await tx.wait().then((receipt) => {
    console.log(`changeArbitrator() receipt: ${JSON.stringify(receipt)}`);
  });

  console.log("changing DisputeTemplate...");
  await hre.run("set-dispute-template");
});
