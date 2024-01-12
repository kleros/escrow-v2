import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "@kleros/ui-components-library";
import { useEscrowCreateTransaction, usePrepareEscrowCreateTransaction } from "hooks/contracts/generated";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { useEnsAddress, usePublicClient } from "wagmi";
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
    deliverableFile,
    sendingQuantity,
    sendingToken,
    sendingRecipientAddress,
    receivingQuantity,
    receivingToken,
    receivingRecipientAddress,
    deadline,
    resetContext,
  } = useNewTransactionContext();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [finalRecipientAddress, setFinalRecipientAddress] = useState(sendingRecipientAddress);
  const ensResult = useEnsAddress({ name: sendingRecipientAddress, chainId: 1 });
  const publicClient = usePublicClient();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (ensResult.data) {
      setFinalRecipientAddress(ensResult.data);
    } else {
      setFinalRecipientAddress(sendingRecipientAddress);
    }
  }, [sendingRecipientAddress, ensResult.data]);

  let templateData = {
    type: escrowType,
    title: escrowTitle,
    ...(escrowType === "general" && { deliverableText, deliverableFile }),
    ...(escrowType === "swap" && {
      receivingQuantity,
      receivingToken,
      receivingRecipientAddress,
      sendingQuantity,
      sendingToken,
    }),
  };

  const stringifiedTemplateData = JSON.stringify(templateData);

  const deadlineTimestamp = new Date(deadline).getTime();
  const timeoutPayment = (deadlineTimestamp - currentTime) / 1000;

  const { config: createTransactionConfig } = usePrepareEscrowCreateTransaction({
    enabled: !isUndefined(ensResult) && ethAddressPattern.test(finalRecipientAddress),
    args: [
      BigInt(Math.floor(timeoutPayment)),
      transactionUri,
      finalRecipientAddress,
      stringifiedTemplateData,
      "", // Assuming no template data mappings are needed
    ],
    value: parseEther(sendingQuantity),
  });

  const { writeAsync: createTransaction } = useEscrowCreateTransaction(createTransactionConfig);

  const handleCreateTransaction = () => {
    if (!isUndefined(createTransaction)) {
      setIsSending(true);
      wrapWithToast(async () => await createTransaction().then((response) => response.hash), publicClient)
        .then(() => {
          resetContext();
          navigate("/");
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
