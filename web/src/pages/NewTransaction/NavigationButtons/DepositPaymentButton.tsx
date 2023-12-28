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
    deliverableFile,
    sendingQuantity,
    sendingToken,
    sendingRecipientAddress,
    receivingQuantity,
    receivingToken,
    receivingRecipientAddress,
    deadline,
  } = useNewTransactionContext();

  const [finalRecipientAddress, setFinalRecipientAddress] = useState(sendingRecipientAddress);
  const ensResult = useEnsAddress({ name: sendingRecipientAddress, chainId: 1 });
  const publicClient = usePublicClient();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    if (ensResult.data) {
      setFinalRecipientAddress(ensResult.data);
    } else {
      setFinalRecipientAddress(sendingRecipientAddress);
    }
  }, [sendingRecipientAddress, ensResult.data]);

  let templateData = {
    title: escrowTitle,
    type: escrowType,
  };

  if (escrowType === "general") {
    Object.assign(templateData, {
      deliverableText,
      deliverableFile,
    });
  } else if (escrowType === "swap") {
    Object.assign(templateData, {
      receivingQuantity,
      receivingToken,
      receivingRecipientAddress,
      sendingQuantity,
      sendingToken,
    });
  }

  const stringifiedTemplateData = JSON.stringify(templateData);

  const deadlineTimestamp = new Date(deadline).getTime();
  const currentTime = Date.now();
  const timeoutPayment = (deadlineTimestamp - currentTime) / 1000;

  const { config: createTransactionConfig } = usePrepareEscrowCreateTransaction({
    enabled: !isUndefined(ensResult) && ethAddressPattern.test(finalRecipientAddress),
    args: [
      BigInt(Math.floor(timeoutPayment)),
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
      wrapWithToast(async () => await createTransaction().then((response) => response.hash), publicClient).finally(
        () => {
          setIsSending(false);
          navigate("/");
        }
      );
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
