import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import {
  useWriteEscrowUniversalCreateNativeTransaction,
  useSimulateEscrowUniversalCreateNativeTransaction,
  useWriteEscrowUniversalCreateErc20Transaction,
  useSimulateEscrowUniversalCreateErc20Transaction,
  escrowUniversalAddress,
} from "hooks/contracts/generated";
import { erc20Abi } from "viem";
import { useNewTransactionContext } from "context/NewTransactionContext";
import {
  useAccount,
  useEnsAddress,
  usePublicClient,
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useBalance,
} from "wagmi";
import { parseEther, parseUnits } from "viem";
import { normalize } from "viem/ens";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { ethAddressPattern } from "utils/validateAddress";
import { useQueryRefetch } from "hooks/useQueryRefetch";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";

const StyledButton = styled(Button)``;

export const ErrorButtonMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  margin: 12px;
  color: ${({ theme }) => theme.error};
  font-size: 14px;
`;

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

  const publicClient = usePublicClient();
  const navigateAndScrollTop = useNavigateAndScrollTop();
  const refetchQuery = useQueryRefetch();
  const [isSending, setIsSending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { address, chain } = useAccount();
  const ensResult = useEnsAddress({ name: normalize(sellerAddress), chainId: 1 });

  const deadlineTimestamp = useMemo(() => {
    const ts = BigInt(Math.floor(new Date(deadline).getTime() / 1000));
    console.log("deadlineTimestamp", ts);
    return ts;
  }, [deadline]);

  const isNativeTransaction = sendingToken?.address === "native";
  console.log("isNativeTransaction", isNativeTransaction);

  const transactionValue = useMemo(() => {
    const val = isNativeTransaction ? parseEther(sendingQuantity) : parseUnits(sendingQuantity, 18);
    console.log("transactionValue", val.toString());
    return val;
  }, [isNativeTransaction, sendingQuantity]);

  const finalRecipientAddress = ensResult.data || sellerAddress;
  console.log("finalRecipientAddress", finalRecipientAddress);

  const { data: nativeBalance } = useBalance({
    query: { enabled: isNativeTransaction },
    address: address as `0x${string}`,
  });
  console.log("nativeBalance", nativeBalance);

  const { data: tokenBalance } = useReadContract({
    query: { enabled: !isNativeTransaction },
    address: sendingToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });
  console.log("tokenBalance", tokenBalance?.toString());

  const insufficientBalance = useMemo(() => {
    if (isUndefined(sendingQuantity)) return true;

    const result = isNativeTransaction
      ? nativeBalance
        ? parseFloat(sendingQuantity) > parseFloat(nativeBalance.value.toString())
        : true
      : isUndefined(tokenBalance)
      ? true
      : parseFloat(sendingQuantity) > parseFloat(tokenBalance.toString());

    console.log("insufficientBalance", result);
    return result;
  }, [sendingQuantity, tokenBalance, nativeBalance, isNativeTransaction]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    query: { enabled: !isNativeTransaction && chain?.id && !insufficientBalance },
    address: sendingToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, escrowUniversalAddress?.[chain?.id]],
  });
  console.log("allowance", allowance?.toString());

  useEffect(() => {
    const approved = !isUndefined(allowance) && allowance >= transactionValue;
    console.log("setIsApproved", approved);
    setIsApproved(approved);
  }, [allowance, transactionValue]);

  const {
    data: createNativeTransactionConfig,
    isLoading: isLoadingNativeConfig,
    isError: isErrorNativeConfig,
    error: nativeSimError,
  } = useSimulateEscrowUniversalCreateNativeTransaction({
    query: {
      enabled: isNativeTransaction && ethAddressPattern.test(finalRecipientAddress) && !insufficientBalance,
    },
    args: [deadlineTimestamp, transactionUri, finalRecipientAddress],
    value: transactionValue,
  });

  const {
    data: createERC20TransactionConfig,
    isLoading: isLoadingERC20Config,
    isError: isErrorERC20Config,
    error: erc20SimError,
  } = useSimulateEscrowUniversalCreateErc20Transaction({
    query: {
      enabled:
        !isNativeTransaction &&
        !isUndefined(allowance) &&
        allowance >= transactionValue &&
        ethAddressPattern.test(finalRecipientAddress) &&
        !insufficientBalance,
    },
    args: [
      transactionValue,
      sendingToken?.address as `0x${string}`,
      deadlineTimestamp,
      transactionUri,
      finalRecipientAddress as `0x${string}`,
    ],
  });

  console.log("isSending", isSending);
  console.log("isLoadingNativeConfig", isLoadingNativeConfig);
  console.log("isLoadingERC20Config", isLoadingERC20Config);
  console.log("isErrorNativeConfig", isErrorNativeConfig);
  console.log("isErrorERC20Config", isErrorERC20Config);
  console.log("nativeSimError", nativeSimError);
  console.log("erc20SimError", erc20SimError);

  const { writeContractAsync: createNativeTransaction } =
    useWriteEscrowUniversalCreateNativeTransaction(createNativeTransactionConfig);

  const { writeContractAsync: createERC20Transaction } =
    useWriteEscrowUniversalCreateErc20Transaction(createERC20TransactionConfig);

  const { data: approveConfig } = useSimulateContract({
    query: { enabled: !isNativeTransaction && chain?.id && !insufficientBalance },
    address: sendingToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "approve",
    args: [escrowUniversalAddress?.[chain?.id], transactionValue],
  });

  const { writeContractAsync: approve } = useWriteContract(approveConfig);

  const handleApproveToken = async () => {
    if (!isUndefined(approve)) {
      setIsSending(true);
      try {
        const wrapResult = await wrapWithToast(async () => await approve(approveConfig.request), publicClient);
        console.log("approve wrapResult", wrapResult);
        setIsApproved(wrapResult.status);
        await refetchAllowance();
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
    const transactionConfig = isNativeTransaction ? createNativeTransactionConfig : createERC20TransactionConfig;

    if (!isUndefined(createTransaction) && !isUndefined(transactionConfig)) {
      setIsSending(true);
      try {
        const wrapResult = await wrapWithToast(
          async () => await createTransaction(transactionConfig.request),
          publicClient
        );
        console.log("createTransaction wrapResult", wrapResult);
        if (wrapResult.status) {
          refetchQuery([["refetchOnBlock", "useMyTransactionsQuery"], ["useUserQuery"]]);
          resetContext();
          navigateAndScrollTop("/transactions/display/1/desc/all");
        }
      } catch (error) {
        console.error("Transaction failed:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const buttonDisabled =
    isSending ||
    insufficientBalance ||
    isLoadingNativeConfig ||
    isLoadingERC20Config ||
    isErrorNativeConfig ||
    isErrorERC20Config;

  console.log("buttonDisabled", buttonDisabled);

  return (
    <div>
      <StyledButton
        isLoading={!insufficientBalance && (isSending || isLoadingNativeConfig || isLoadingERC20Config)}
        disabled={buttonDisabled}
        text={isNativeTransaction || isApproved ? "Deposit the Payment" : "Approve Token"}
        onClick={isNativeTransaction || isApproved ? handleCreateTransaction : handleApproveToken}
      />
      {insufficientBalance && (
        <ErrorButtonMessage>
          <ClosedCircleIcon /> Insufficient balance
        </ErrorButtonMessage>
      )}
    </div>
  );
};

export default DepositPaymentButton;
