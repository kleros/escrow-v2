import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "@kleros/ui-components-library";
import { useEscrowCreateTransaction, usePrepareEscrowCreateTransaction } from "hooks/contracts/generated";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { useAccount, useEnsAddress, usePublicClient } from "wagmi";
import { parseEther } from "viem";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { ethAddressPattern } from "../Terms/Payment/DestinationAddress";

const StyledButton = styled(Button)``;

const DepositPaymentButton: React.FC = () => {
  const {
    escrowType,
    escrowTitle,
    deliverableText,
    transactionUri,
    extraDescriptionUri,
    sendingQuantity,
    sellerAddress,
    deadline,
    resetContext,
  } = useNewTransactionContext();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [finalRecipientAddress, setFinalRecipientAddress] = useState(sellerAddress);
  const ensResult = useEnsAddress({ name: sellerAddress, chainId: 1 });
  const publicClient = usePublicClient();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { address } = useAccount();

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (ensResult.data) {
      setFinalRecipientAddress(ensResult.data);
    } else {
      setFinalRecipientAddress(sellerAddress);
    }
  }, [sellerAddress, ensResult.data]);

  const deadlineTimestamp = new Date(deadline).getTime();
  const timeoutPayment = (deadlineTimestamp - currentTime) / 1000;

  const templateData = {
    $schema: "../NewDisputeTemplate.schema.json",
    title: escrowTitle,
    description: deliverableText,
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
      uri: extraDescriptionUri,
    },
    frontendUrl: `https://escrow-v2.kleros.builders/#/myTransactions/%s`,
    arbitrableChainID: "421614",
    arbitrableAddress: "0x250AB0477346aDFC010585b58FbF61cff1d8f3ea",
    arbitratorChainID: "421614",
    arbitratorAddress: "0xA54e7A16d7460e38a8F324eF46782FB520d58CE8",
    metadata: {
      buyer: address,
      seller: sellerAddress,
      amount: sendingQuantity,
      asset: escrowType === "general" ? "native" : "",
      timeoutPayment: timeoutPayment,
      transactionUri: transactionUri,
    },
    category: "Escrow",
    specification: "KIPXXX",
    aliases: {
      Buyer: address,
      Seller: sellerAddress,
    },
    version: "1.0",
  };

  const stringifiedTemplateData = JSON.stringify(templateData);

  const { config: createTransactionConfig } = usePrepareEscrowCreateTransaction({
    enabled: !isUndefined(ensResult) && ethAddressPattern.test(finalRecipientAddress),
    args: [
      BigInt(Math.floor(timeoutPayment)),
      transactionUri,
      finalRecipientAddress,
      stringifiedTemplateData,
      /* Assuming no template data mappings are needed*/
      ,
    ],
    value: parseEther(sendingQuantity),
  });

  const { writeAsync: createTransaction } = useEscrowCreateTransaction(createTransactionConfig);

  const handleCreateTransaction = () => {
    if (!isUndefined(createTransaction)) {
      setIsSending(true);
      wrapWithToast(async () => await createTransaction().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            resetContext();
            navigate("/myTransactions/display/1/desc/all");
          }
        })
        .catch((error) => {
          console.error("Transaction failed:", error);
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  return (
    <StyledButton
      isLoading={isSending}
      disabled={isSending}
      text="Deposit the Payment"
      onClick={handleCreateTransaction}
    />
  );
};

export default DepositPaymentButton;
