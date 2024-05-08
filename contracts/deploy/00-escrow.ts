import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";

const disputeTemplate = `{
  "title": "{{escrowTitle}}",
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
  "policyURI": "ipfs://TODO",
  "attachment": {
      "label": "Transaction Terms",
      "uri": "{{extraDescriptionUri}}"
  },
  "frontendUrl": "https://escrow-v2.kleros.builders/#/myTransactions/%s",
  "arbitrableChainID": "421614",
  "arbitrableAddress": "0x250AB0477346aDFC010585b58FbF61cff1d8f3ea",
  "arbitratorChainID": "421614",
  "arbitratorAddress": "0xA54e7A16d7460e38a8F324eF46782FB520d58CE8",
  "metadata": {
      "buyer": "{{address}}",
      "seller": "{{sendingRecipientAddress}}",
      "amount": "{{sendingQuantity}}",
      "asset": "{{escrowType}}",
      "timeoutPayment": "{{timeoutPayment}}",
      "transactionUri": "{{transactionUri}}"
  },
  "category": "Escrow",
  "specification": "KIPXXX",
  "aliases": {
      "Buyer": "{{address}}",
      "Seller": "{{sendingRecipientAddress}}"
  },
  "version": "1.0"
}
`;

const mapping = `{}`;

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
  
  await deploy("Escrow", {
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
  
  await deploy("EscrowToken", {
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
