import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";

export const disputeTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
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

export const mapping = `[
  {
    "type": "graphql",
    "endpoint": "https://gateway-arbitrum.network.thegraph.com/api/{{{graphApiKey}}}/subgraphs/id/3aZxYcZpZL5BuVhuUupqVrCV8VeNyZEvjmPXibyPHDFQ", // we need to create a subgraph in arbitrum one, then change the id here.
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

// General court, 3 jurors
const extraData =
  "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to %s with deployer %s", HomeChains[chainId], deployer);

  const klerosCore = await deployments.get("KlerosCore");
  const disputeTemplateRegistry = await deployments.get("DisputeTemplateRegistry");
  const feeTimeout = 600; // 10 minutes
  const settlementTimeout = 600; // 10 minutes

  await deploy("EscrowUniversal", {
    from: deployer,
    args: [
      klerosCore.address,
      extraData,
      disputeTemplate,
      mapping,
      disputeTemplateRegistry.address,
      feeTimeout,
      settlementTimeout,
    ],
    log: true,
  });
};

deploy.tags = ["Escrow"];
deploy.skip = async ({ network }) => {
  return isSkipped(network, !HomeChains[network.config.chainId ?? 0]);
};

export default deploy;
