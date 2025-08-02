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
import { pickBufferFor } from "utils/bufferRules";
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
    transactionUri,
    sendingQuantity,
    buyerAddress,
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
  const buyerEnsResult = useEnsAddress({ name: normalize(buyerAddress), chainId: 1 });
  const sellerEnsResult = useEnsAddress({ name: normalize(sellerAddress), chainId: 1 });
  const finalBuyerAddress = buyerEnsResult.data || buyerAddress;
  const finalSellerAddress = sellerEnsResult.data || sellerAddress;

  const deliveryDeadlineTimestamp = useMemo(
    () => BigInt(Math.floor(new Date(deadline).getTime() / 1000)),
    [deadline]
  );

  const bufferSec = useMemo(() => BigInt(pickBufferFor(Math.floor(Date.now() / 1000))), []);
  const disputeDeadlineTimestamp = useMemo(() => deliveryDeadlineTimestamp + bufferSec, [deliveryDeadlineTimestamp, bufferSec]);
  const isNativeTransaction = sendingToken?.address === "native";
  const transactionValue = useMemo(
    () => (isNativeTransaction ? parseEther(sendingQuantity) : parseUnits(sendingQuantity, 18)),
    [isNativeTransaction, sendingQuantity]
  );

  const { data: nativeBalance } = useBalance({
    query: { enabled: isNativeTransaction },
    address: address as `0x${string}`,
  });

  const { data: tokenBalance } = useReadContract({
    query: { enabled: !isNativeTransaction },
    address: sendingToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  const insufficientBalance = useMemo(() => {
    if (isUndefined(sendingQuantity)) return true;

    if (isNativeTransaction) {
      return nativeBalance ? parseFloat(sendingQuantity) > parseFloat(nativeBalance.value.toString()) : true;
    }

    return isUndefined(tokenBalance) ? true : parseFloat(sendingQuantity) > parseFloat(tokenBalance.toString());
  }, [sendingQuantity, tokenBalance, nativeBalance, isNativeTransaction]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    query: { enabled: !isNativeTransaction && chain?.id && !insufficientBalance },
    address: sendingToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, escrowUniversalAddress?.[chain?.id]],
  });

  useEffect(() => {
    if (!isUndefined(allowance)) {
      setIsApproved(allowance >= transactionValue);
    }
  }, [allowance, transactionValue]);

  const {
    data: createNativeTransactionConfig,
    isLoading: isLoadingNativeConfig,
    isError: isErrorNativeConfig,
  } = useSimulateEscrowUniversalCreateNativeTransaction({
    query: {
      enabled: isNativeTransaction && 
      ethAddressPattern.test(finalBuyerAddress) && 
      ethAddressPattern.test(finalSellerAddress) && 
      !insufficientBalance,
    },
    args: [disputeDeadlineTimestamp, transactionUri, finalBuyerAddress, finalSellerAddress],
    value: transactionValue,
  });

  const {
    data: createERC20TransactionConfig,
    isLoading: isLoadingERC20Config,
    isError: isErrorERC20Config,
  } = useSimulateEscrowUniversalCreateErc20Transaction({
    query: {
      enabled:
        !isNativeTransaction &&
        !isUndefined(allowance) &&
        allowance >= transactionValue &&
        ethAddressPattern.test(finalBuyerAddress) &&
        ethAddressPattern.test(finalSellerAddress) &&
        !insufficientBalance,
    },
    args: [
      transactionValue,
      sendingToken?.address as `0x${string}`,
      disputeDeadlineTimestamp,
      transactionUri,
      finalBuyerAddress as `0x${string}`,
      finalSellerAddress as `0x${string}`,
    ],
  });

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

  return (
    <div>
      <StyledButton
        isLoading={!insufficientBalance && (isSending || isLoadingNativeConfig || isLoadingERC20Config)}
        disabled={
          isSending ||
          insufficientBalance ||
          isLoadingNativeConfig ||
          isLoadingERC20Config ||
          isErrorNativeConfig ||
          isErrorERC20Config
        }
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
