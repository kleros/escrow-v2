// import { BigNumber, utils } from "ethers";
import { task } from "hardhat/config";
import { EscrowUniversal } from "../typechain-types";

const parameters = {
  arbitrumSepoliaDevnet: {
    arbitrator: "KlerosCore",
    subgraphEndpoint:
      "https://gateway-arbitrum.network.thegraph.com/api/{{{graphApiKey}}}/subgraphs/id/3aZxYcZpZL5BuVhuUupqVrCV8VeNyZEvjmPXibyPHDFQ",
  },
  arbitrumSepoliaTestnet: {
    arbitrator: "KlerosCore",
    subgraphEndpoint: "TODO",
  },
  arbitrum: {
    arbitrator: "KlerosCoreNeo",
    subgraphEndpoint: "TODO",
  },
};

const disputeTemplateFn = (chainId: number, klerosCore: string) => `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Escrow dispute: {{escrowTitle}}", 
  "description": "{{deliverableText}}", 
  "question": "Which party abided by the terms of the contract?",
  "answers": [
    {
      "id":"0x1",
      "title": "Refund the Buyer",
      "description": "Select this to return the funds to the Buyer."
    },
    {
      "id":"0x2",
      "title": "Pay the Seller",
      "description": "Select this to release the funds to the Seller."
    }
  ],
  "policyURI": "/ipfs/QmTaZuQjJT9NZCYsqyRmEwLb1Vt3gme1a6BS4NQLiWXtH2", // General policy for escrows in progress
  "attachment": { 
    "label": "Transaction Terms",
    "uri": "{{{extraDescriptionUri}}}"
  },
  "frontendUrl": "https://escrow-v2.kleros.builders/#/transactions/{{externalDisputeID}}", 
  "arbitratorChainID": "${chainId}",
  "arbitratorAddress": "${klerosCore}", 
  "metadata": {
    "buyer": "{{buyer}}",
    "seller": "{{seller}}",
    "amount": "{{amount}}",
    "token": "{{token}}",
    "deadline": "{{deadline}}",
    "transactionUri": "{{{transactionUri}}}" 
  },
  "category": "Escrow",
  "aliases": {
    "Buyer": "{{buyer}}",
    "Seller": "{{seller}}"
  },
  "version": "1.0"
}
`;

const mappingFn = (subgraphEndpoint: string) => `[
  {
    "type": "graphql",
    "endpoint": "${subgraphEndpoint}", // we need to create a subgraph in arbitrum one, then change the id here.
    "query": "query GetTransaction($transactionId: ID!) { escrow(id: $transactionId) { transactionUri buyer seller amount token deadline } }",
    "variables": {
      "transactionId": "{{externalDisputeID}}"
    },
    "seek": ["escrow.transactionUri", "escrow.buyer", "escrow.seller", "escrow.amount", "escrow.token", "escrow.deadline"],
    "populate": ["transactionUri", "buyer", "seller", "amount", "token", "deadline"]
  },
  {
    "type": "fetch/ipfs/json",
    "ipfsUri": "{{{transactionUri}}}",
    "seek": ["title", "description", "extraDescriptionUri"],
    "populate": ["escrowTitle", "deliverableText", "extraDescriptionUri"]
  }
]`;

task("setDisputeTemplate", "Sets the dispute template").setAction(async (args, hre) => {
  const { ethers, config, deployments } = hre;
  const escrow = (await ethers.getContract("EscrowUniversal")) as EscrowUniversal;
  const networkName = await deployments.getNetworkName();
  const { arbitrator, subgraphEndpoint } = parameters[networkName];
  const klerosCore = await deployments.get(arbitrator).then((c) => c.address);
  const chainId = config.networks[networkName].chainId;

  if (!chainId || !klerosCore || !subgraphEndpoint) {
    throw new Error("Missing parameters");
  }

  const disputeTemplate = disputeTemplateFn(chainId, klerosCore);
  console.log("New disputeTemplate", disputeTemplate);

  const mapping = mappingFn(subgraphEndpoint);
  console.log("New mapping", mapping);

  const tx = await escrow.changeDisputeTemplate(disputeTemplate, mapping);
  await tx.wait().then((receipt) => {
    console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);
  });
});
