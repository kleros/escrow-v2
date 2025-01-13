// import { BigNumber, utils } from "ethers";
import { task } from "hardhat/config";
import { Escrow } from "../typechain-types";

const disputeTemplate = `{
  "title": "Escrow dispute: {{escrowTitle}}", 
  "description": "{{deliverableText}}", 
  "question": "Which party abided by the terms of the contract?",
  "answers": [
    {
      "title": "Refund the Buyer",
      "description": "Select this to return the funds to the Buyer."
    },
    {
      "title": "Pay the Seller",
      "description": "Select this to release the funds to the Seller."
    }
  ],
  "policyURI": "/ipfs/XxxxxXXX/escrow-general-policy.pdf", // we need a general policy for escrows, ask the policy writer?
  "attachment": { 
    "label": "Transaction Terms",
    "uri": "{{{extraDescriptionUri}}}"
  },
  "frontendUrl": "https://escrow-v2.kleros.builders/#/transactions/{{externalDisputeID}}", 
  "arbitratorChainID": "42161",
  "arbitratorAddress": "0x991d2df165670b9cac3B022f4B68D65b664222ea", 
  "metadata": {
    "buyer": "{{buyer}}",
    "seller": "{{seller}}",
    "amount": "{{amount}}",
    "token": "{{token}}",
    "deadline": "{{deadline}}",
    "transactionUri": "{{{transactionUri}}}" 
  },
  "category": "Escrow",
  "specification": "KIPXXX", // what do we set this to, or do we just delete it?
  "aliases": {
    "Buyer": "{{buyer}}",
    "Seller": "{{seller}}"
  },
  "version": "1.0"
}
`;

task("setDisputeTemplate", "Sets the dispute template").setAction(async (args, hre) => {
  const { ethers } = hre;
  const escrow = (await ethers.getContract("Escrow")) as Escrow;

  const mappingJson = "{}";

  const tx = await escrow.changeDisputeTemplate(disputeTemplate, mappingJson);
  await tx.wait().then((receipt) => {
    console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);
  });
});
