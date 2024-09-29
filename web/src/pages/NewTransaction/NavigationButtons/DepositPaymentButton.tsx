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
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { ethAddressPattern } from "utils/validateAddress";
import { useQueryRefetch } from "hooks/useQueryRefetch";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";

const StyledButton = styled(Button)``;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  margin: 12px;
  color: ${({ theme }) => theme.error};
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
    setHasSufficientNativeBalance,
  } = useNewTransactionContext();

  const [finalRecipientAddress, setFinalRecipientAddress] = useState(sellerAddress);
  const publicClient = usePublicClient();
  const navigateAndScrollTop = useNavigateAndScrollTop();
  const refetchQuery = useQueryRefetch();
  const [isSending, setIsSending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { address, chain } = useAccount();
  const ensResult = useEnsAddress({ name: sellerAddress, chainId: 1 });
  const deadlineTimestamp = useMemo(() => BigInt(Math.floor(new Date(deadline).getTime() / 1000)), [deadline]);
  const isNativeTransaction = sendingToken?.address === "native";
  const transactionValue = useMemo(
    () => (isNativeTransaction ? parseEther(sendingQuantity) : parseUnits(sendingQuantity, 18)),
    [isNativeTransaction, sendingQuantity]
  );

  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
    token: isNativeTransaction ? undefined : sendingToken?.address as `0x${string}` | undefined,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFinalRecipientAddress(ensResult.data || sellerAddress);
  }, [sellerAddress, ensResult.data]);

  useEffect(() => {
    const balance = parseFloat(balanceData?.formatted || "0");
    const quantity = parseFloat(sendingQuantity);

    if (quantity > balance) {
      setError("Insufficient balance");
      setHasSufficientNativeBalance(false);
    } else if (quantity === 0) {
      setError("Amount cannot be zero");
      setHasSufficientNativeBalance(false);
    } else {
      setError(null);
      setHasSufficientNativeBalance(true);
    }
  }, [balanceData, sendingQuantity, setHasSufficientNativeBalance]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    query: { enabled: !isNativeTransaction && chain?.id },
    address: sendingToken?.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, escrowUniversalAddress?.[chain?.id]],
  });

  useEffect(() => {
    if (!isUndefined(allowance)) {
      setIsApproved(allowance >= transactionValue);
    }
  }, [allowance, transactionValue]);

  const { data: createNativeTransactionConfig } = useSimulateEscrowUniversalCreateNativeTransaction({
    query: {
      enabled: isNativeTransaction && ethAddressPattern.test(finalRecipientAddress),
    },
    args: [deadlineTimestamp, transactionUri, finalRecipientAddress],
    value: transactionValue,
  });

  const { data: createERC20TransactionConfig } = useSimulateEscrowUniversalCreateErc20Transaction({
    query: {
      enabled:
        !isNativeTransaction &&
        !isUndefined(allowance) &&
        allowance >= transactionValue &&
        ethAddressPattern.test(finalRecipientAddress),
    },
    args: [transactionValue, sendingToken?.address, deadlineTimestamp, transactionUri, finalRecipientAddress],
  });

  const { writeContractAsync: createNativeTransaction } =
    useWriteEscrowUniversalCreateNativeTransaction(createNativeTransactionConfig);

  const { writeContractAsync: createERC20Transaction } =
    useWriteEscrowUniversalCreateErc20Transaction(createERC20TransactionConfig);

  const { data: approveConfig } = useSimulateContract({
    query: { enabled: !isNativeTransaction && chain?.id },
    address: sendingToken?.address,
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
        isLoading={isSending}
        disabled={isSending || !!error}
        tooltip={error}
        text={isNativeTransaction || isApproved ? "Deposit the Payment" : "Approve Token"}
        onClick={isNativeTransaction || isApproved ? handleCreateTransaction : handleApproveToken}
      />
      {error ? <ErrorMessage><ClosedCircleIcon /> {error}</ErrorMessage> : null}
    </div>
  );
};

export default DepositPaymentButton;
