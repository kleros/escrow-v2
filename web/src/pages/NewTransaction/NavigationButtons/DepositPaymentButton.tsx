import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "@kleros/ui-components-library";
import {
  useEscrowUniversalCreateNativeTransaction,
  usePrepareEscrowUniversalCreateNativeTransaction,
  useEscrowUniversalCreateErc20Transaction,
  usePrepareEscrowUniversalCreateErc20Transaction,
  escrowUniversalAddress,
} from "hooks/contracts/generated";
import { erc20ABI, useNetwork } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import {
  useAccount,
  useEnsAddress,
  usePublicClient,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { parseEther, parseUnits } from "viem";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { ethAddressPattern } from "utils/validateAddress";

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
    sendingToken,
    resetContext,
  } = useNewTransactionContext();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [finalRecipientAddress, setFinalRecipientAddress] = useState(sellerAddress);
  const [checkedAllowance, setCheckedAllowance] = useState(false);
  const ensResult = useEnsAddress({ name: sellerAddress, chainId: 1 });
  const publicClient = usePublicClient();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { address } = useAccount();
  const { chain } = useNetwork();

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
  const isNativeTransaction = sendingToken === "native";

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
    frontendUrl: `https://escrow-v2.kleros.builders/#/my-transactions/%s`,
    arbitrableChainID: "421614",
    arbitrableAddress: "0x250AB0477346aDFC010585b58FbF61cff1d8f3ea",
    arbitratorChainID: "421614",
    arbitratorAddress: "0xA54e7A16d7460e38a8F324eF46782FB520d58CE8",
    metadata: {
      buyer: address,
      seller: sellerAddress,
      amount: sendingQuantity,
      token: isNativeTransaction ? "native" : sendingToken,
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

  const transactionValue = isNativeTransaction ? parseEther(sendingQuantity) : parseUnits(sendingQuantity, 18);

  const { config: createNativeTransactionConfig } = usePrepareEscrowUniversalCreateNativeTransaction({
    enabled: !isUndefined(ensResult) && ethAddressPattern.test(finalRecipientAddress) && isNativeTransaction,
    args: [BigInt(Math.floor(timeoutPayment)), transactionUri, finalRecipientAddress, stringifiedTemplateData, ""],
    value: transactionValue,
  });

  const { config: createERC20TransactionConfig } = usePrepareEscrowUniversalCreateErc20Transaction({
    enabled: !isUndefined(ensResult) && ethAddressPattern.test(finalRecipientAddress) && !isNativeTransaction,
    args: [
      transactionValue,
      sendingToken,
      BigInt(Math.floor(timeoutPayment)),
      transactionUri,
      finalRecipientAddress,
      stringifiedTemplateData,
      "",
    ],
  });

  const { writeAsync: createNativeTransaction } =
    useEscrowUniversalCreateNativeTransaction(createNativeTransactionConfig);
  const { writeAsync: createERC20Transaction } = useEscrowUniversalCreateErc20Transaction(createERC20TransactionConfig);

  const { config: approveConfig } = usePrepareContractWrite({
    address: sendingToken,
    abi: erc20ABI,
    functionName: "approve",
    args: [escrowUniversalAddress?.[chain?.id], transactionValue],
  });

  const { writeAsync: approve } = useContractWrite(approveConfig);

  const { data: allowance } = useContractRead({
    address: sendingToken,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, escrowUniversalAddress?.[chain?.id]],
  });

  useEffect(() => {
    if (allowance !== undefined && !checkedAllowance) {
      setCheckedAllowance(true);
      setIsApproved(allowance >= transactionValue);
    }
  }, [allowance, transactionValue, checkedAllowance]);

  const handleApproveToken = async () => {
    if (!isUndefined(approve)) {
      setIsSending(true);
      try {
        const wrapResult = await wrapWithToast(
          async () => await approve().then((response) => response.hash),
          publicClient
        );
        if (wrapResult.status) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      } catch (error) {
        console.error("Approval failed:", error);
        setIsApproved(false);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleCreateTransaction = async () => {
    const createTransaction = isNativeTransaction ? createNativeTransaction : createERC20Transaction;
    if (!isUndefined(createTransaction)) {
      setIsSending(true);
      wrapWithToast(async () => await createTransaction().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            resetContext();
            navigate("/my-transactions/display/1/desc/all");
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
      text={isNativeTransaction || isApproved ? "Deposit the Payment" : "Approve Token"}
      onClick={isNativeTransaction || isApproved ? handleCreateTransaction : handleApproveToken}
    />
  );
};

export default DepositPaymentButton;
