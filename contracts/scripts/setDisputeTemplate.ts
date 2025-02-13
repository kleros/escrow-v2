// import { BigNumber, utils } from "ethers";
import { task } from "hardhat/config";
import { EscrowUniversal, EscrowView } from "../typechain-types";
import { Addressable } from "ethers/lib.commonjs/address";

const parameters = {
  arbitrumSepoliaDevnet: {
    arbitrator: "KlerosCore",
    subgraphEndpoint:
      "https://gateway.thegraph.com/api/{{{graphApiKey}}}/subgraphs/id/3aZxYcZpZL5BuVhuUupqVrCV8VeNyZEvjmPXibyPHDFQ",
  },
  arbitrumSepoliaTestnet: {
    arbitrator: "KlerosCore",
    subgraphEndpoint: "TODO",
  },
  arbitrum: {
    arbitrator: "KlerosCoreNeo",
    subgraphEndpoint:
      "https://gateway.thegraph.com/api/{{{graphApiKey}}}/subgraphs/id/96vpnRJbRVkzF6usMNYMMoziSZEfSwGEDpXNi2h9WBSW",
  },
};

const disputeTemplateFn = (chainId: number, klerosCore: string) => `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Escrow dispute: {{escrowTitle}}", 
  "description": "{{deliverableText}}", 
  "question": "Which party abided by the terms of the contract?",
  "answers": [
    {
      "id": "0x00",
      "title": "Refuse to Arbitrate / Invalid.",
      "description": "{{noWinner}}"
    },
    {
      "id": "0x01",
      "title": "Refund the Buyer",
      "description": "{{buyerWins}}"
    },
    {
      "id": "0x02",
      "title": "Pay the Seller",
      "description": "{{sellerWins}}"
    }
  ],
  "policyURI": "/ipfs/QmTaZuQjJT9NZCYsqyRmEwLb1Vt3gme1a6BS4NQLiWXtH2",
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

const mappingFn = (subgraphEndpoint: string, view: string | Addressable) => `[
  {
    "type": "graphql",
    "endpoint": "${subgraphEndpoint}",
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
  },
  {
    "type": "abi/call",
    "abi": "function getPayoutMessages(uint256) returns (string, string, string)",
    "functionName": "getPayoutMessages",
    "address": "${view}",
    "args": ["0"],
    "seek": ["0", "1", "2"],
    "populate": ["noWinner", "buyerWins", "sellerWins"]
  }
]`;

task("set-dispute-template", "Sets the dispute template").setAction(async (args, hre) => {
  const { ethers, config, deployments } = hre;
  const escrow = (await ethers.getContract("EscrowUniversal")) as EscrowUniversal;
  const view = (await ethers.getContract("EscrowView")) as EscrowView;
  const networkName = await deployments.getNetworkName();
  const { arbitrator, subgraphEndpoint } = parameters[networkName];
  const klerosCore = await deployments.get(arbitrator).then((c) => c.address);
  const chainId = config.networks[networkName].chainId;

  if (!chainId || !klerosCore || !subgraphEndpoint) {
    throw new Error("Missing parameters");
  }

  const disputeTemplate = disputeTemplateFn(chainId, klerosCore);
  console.log("New disputeTemplate", disputeTemplate);

  const mapping = mappingFn(subgraphEndpoint, view.target);
  console.log("New mapping", mapping);

  const tx = await escrow.changeDisputeTemplate(disputeTemplate, mapping);
  await tx.wait().then((receipt) => {
    console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);
  });
});
