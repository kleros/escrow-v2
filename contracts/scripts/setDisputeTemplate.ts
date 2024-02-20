// import { BigNumber, utils } from "ethers";
import { task } from "hardhat/config";
import { Escrow } from "../typechain-types";

const disputeTemplate = {
  title: "{{escrowTitle}}",
  description: "{{deliverableText}}",
  question: "Which party abided by the terms of the contract?",
  answers: [
    {
      title: "Refund the Buyer",
      description: "Select this to return the funds to the Buyer.",
    },
    {
      title: "Pay the Seller",
      description: "Select this to release the funds to the Seller.",
    },
  ],
  policyURI: "ipfs://TODO",
  attachment: {
    label: "Transaction Terms",
    uri: "{{extraDescriptionUri}}",
  },
  frontendUrl: "https://escrow-v2.kleros.builders/#/myTransactions/{{transactionId}}",
  arbitrableChainID: "421614",
  arbitrableAddress: "0x250AB0477346aDFC010585b58FbF61cff1d8f3ea",
  arbitratorChainID: "421614",
  arbitratorAddress: "0xA54e7A16d7460e38a8F324eF46782FB520d58CE8",
  metadata: {
    buyer: "{{address}}",
    seller: "{{sendingRecipientAddress}}",
    amount: "{{sendingQuantity}}",
    asset: "{{asset}}",
    deadline: "{{deadline}}",
    transactionUri: "{{transactionUri}}",
  },
  category: "Escrow",
  specification: "KIPXXX",
  aliases: {
    Buyer: "{{address}}",
    Seller: "{{sendingRecipientAddress}}",
  },
  version: "1.0",
};

task("setDisputeTemplate", "Sets the dispute template").setAction(async (args, hre) => {
  const { ethers } = hre;
  const escrow = (await ethers.getContract("Escrow")) as Escrow;

  const disputeTemplateJson = JSON.stringify(disputeTemplate, null, 0);
  const mappingJson = "{}";

  const tx = await escrow.changeDisputeTemplate(disputeTemplateJson, mappingJson);
  await tx.wait().then((receipt) => {
    console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);
  });
});
