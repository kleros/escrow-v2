import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
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
import { useQueryRefetch } from "hooks/useQueryRefetch";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";

const StyledButton = styled(Button)``;

const DepositPaymentButton: React.FC = () => {
  const {
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
  const publicClient = usePublicClient();
  const navigateAndScrollTop = useNavigateAndScrollTop();
  const refetchQuery = useQueryRefetch();
  const [isSending, setIsSending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const ensResult = useEnsAddress({ name: sellerAddress, chainId: 1 });
  const deadlineTimestamp = useMemo(() => new Date(deadline).getTime(), [deadline]);
  const timeoutPayment = useMemo(() => (deadlineTimestamp - currentTime) / 1000, [deadlineTimestamp, currentTime]);
  const isNativeTransaction = sendingToken?.address === "native";
  const transactionValue = useMemo(
    () => (isNativeTransaction ? parseEther(sendingQuantity) : parseUnits(sendingQuantity, 18)),
    [isNativeTransaction, sendingQuantity]
  );
  const isDeadlinePassed = currentTime >= deadlineTimestamp;

  useEffect(() => {
    if (isDeadlinePassed) {
      navigateAndScrollTop("/new-transaction/deadline");
    }
  }, [isDeadlinePassed, navigateAndScrollTop]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setFinalRecipientAddress(ensResult.data || sellerAddress);
  }, [sellerAddress, ensResult.data]);

  const { data: allowance } = useContractRead({
    enabled: !isNativeTransaction && !isDeadlinePassed,
    address: sendingToken?.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, escrowUniversalAddress?.[chain?.id]],
  });

  useEffect(() => {
    if (!isUndefined(allowance)) {
      setIsApproved(allowance >= transactionValue);
    }
  }, [allowance, transactionValue]);

  const templateData = useMemo(
    () =>
      JSON.stringify({
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
          token: isNativeTransaction ? "native" : sendingToken?.address,
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
      }),
    [
      escrowTitle,
      deliverableText,
      extraDescriptionUri,
      sendingQuantity,
      sellerAddress,
      address,
      isNativeTransaction,
      sendingToken?.address,
      timeoutPayment,
      transactionUri,
    ]
  );

  const { config: createNativeTransactionConfig } = usePrepareEscrowUniversalCreateNativeTransaction({
    enabled: isNativeTransaction && ethAddressPattern.test(finalRecipientAddress) && !isDeadlinePassed,
    args: [BigInt(Math.floor(timeoutPayment)), transactionUri, finalRecipientAddress, templateData, ""],
    value: transactionValue,
  });

  const { config: createERC20TransactionConfig } = usePrepareEscrowUniversalCreateErc20Transaction({
    enabled:
      !isNativeTransaction &&
      !isUndefined(allowance) &&
      allowance >= transactionValue &&
      ethAddressPattern.test(finalRecipientAddress) &&
      !isDeadlinePassed,
    args: [
      transactionValue,
      sendingToken?.address,
      BigInt(Math.floor(timeoutPayment)),
      transactionUri,
      finalRecipientAddress,
      templateData,
      "",
    ],
  });

  const { writeAsync: createNativeTransaction } =
    useEscrowUniversalCreateNativeTransaction(createNativeTransactionConfig);
  const { writeAsync: createERC20Transaction } = useEscrowUniversalCreateErc20Transaction(createERC20TransactionConfig);

  const { config: approveConfig } = usePrepareContractWrite({
    enabled: !isNativeTransaction && !isDeadlinePassed,
    address: sendingToken?.address,
    abi: erc20ABI,
    functionName: "approve",
    args: [escrowUniversalAddress?.[chain?.id], transactionValue],
  });

  const { writeAsync: approve } = useContractWrite(approveConfig);

  const handleApproveToken = async () => {
    if (!isUndefined(approve)) {
      setIsSending(true);
      try {
        const wrapResult = await wrapWithToast(
          async () => await approve().then((response) => response.hash),
          publicClient
        );
        setIsApproved(wrapResult.status);
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
      try {
        const wrapResult = await wrapWithToast(
          async () => await createTransaction().then((response) => response.hash),
          publicClient
        );
        if (wrapResult.status) {
          refetchQuery([["refetchOnBlock", "useMyTransactionsQuery"], ["useUserQuery"]]);
          resetContext();
          navigateAndScrollTop("/my-transactions/display/1/desc/all");
        }
      } catch (error) {
        console.error("Transaction failed:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <StyledButton
      isLoading={isSending}
      disabled={isSending || isDeadlinePassed}
      text={isNativeTransaction || isApproved ? "Deposit the Payment" : "Approve Token"}
      onClick={isNativeTransaction || isApproved ? handleCreateTransaction : handleApproveToken}
    />
  );
};

export default DepositPaymentButton;
