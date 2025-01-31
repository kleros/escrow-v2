// import { BigNumber, utils } from "ethers";
import { task } from "hardhat/config";
import { EscrowUniversal, EscrowView } from "../typechain-types";

task("testPayoutMessages", "Tests the payout messages").setAction(async (args, hre) => {
  const { ethers } = hre;
  const escrow = (await ethers.getContract("EscrowUniversal")) as EscrowUniversal;
  const view = (await ethers.getContract("EscrowView")) as EscrowView;

  const seller = (await hre.ethers.getSigners())[1];
  const deadline = Math.floor(Date.now() / 1000) + 10;

  try {
    await escrow.createNativeTransaction(
      deadline,
      "/ipfs/QmWRTngdTzTTq89L8r7XCwbRHrmuaNqzmvW7Cqk3s1FS9C",
      seller.address,
      {
        value: ethers.parseEther("0.5"),
      }
    );

    const txId = await escrow.getTransactionCount().then((count) => count - 1n);
    console.log("Transaction ID:", txId);

    // console.log(await escrow.transactions(txId));

    // console.log("Buyer proposes settlement");
    // await escrow.proposeSettlement(txId, ethers.parseEther("0.1"));

    console.log("Seller proposes settlement");
    await escrow.connect(seller).proposeSettlement(txId, ethers.parseEther("0.4"));

    await new Promise((resolve) => setTimeout(resolve, 3000));
    // await ethers.provider.send("evm_increaseTime", [deadline - 1]);

    console.log("Paying arbitration fee by seller");
    await escrow.connect(seller).payArbitrationFeeBySeller(txId, {
      value: ethers.parseEther("0.3"),
      gasLimit: 2000000,
    });

    console.log("Paying arbitration fee by buyer");
    await escrow.payArbitrationFeeByBuyer(txId, {
      value: ethers.parseEther("0.3"),
      gasLimit: 2000000,
    });

    // console.log(await escrow.transactions(txId));

    const extraData = ethers.AbiCoder.defaultAbiCoder().encode(["uint96", "uint96"], [1, 3]);
    const core = await ethers.getContract("KlerosCore");
    console.log("Arbitration fees", await core.arbitrationCost(extraData), "\n");

    // console.log(await escrow.getPayouts(txId, 0));
    // console.log(await escrow.getPayouts(txId, 1));
    // console.log(await escrow.getPayouts(txId, 2));

    const tx2 = await view.getPayoutMessages(txId);
    console.log("Refuse to Arbitration:\n", tx2[0], "\n");
    console.log("Buyer is correct:\n", tx2[1], "\n");
    console.log("Seller is correct:\n", tx2[2], "\n");
  } catch (error) {
    console.log(error);
  }
});
