// import { BigNumber, utils } from "ethers";
import { task } from "hardhat/config";
import { Escrow } from "../typechain-types";
import { disputeTemplate, mapping } from "../deploy/00-escrow";

task("setDisputeTemplate", "Sets the dispute template").setAction(async (args, hre) => {
  const { ethers } = hre;
  const escrow = (await ethers.getContract("Escrow")) as Escrow;

  const tx = await escrow.changeDisputeTemplate(disputeTemplate, mapping);
  await tx.wait().then((receipt) => {
    console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);
  });
});
