import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useNewTransactionContext } from "context/NewTransactionContext";
import {
  useSimulateEscrowUniversalExecuteTransaction,
  useWriteEscrowUniversalExecuteTransaction,
} from "hooks/contracts/generated";
import { useQueryRefetch } from "hooks/useQueryRefetch";

const ExecuteTransactionButton: React.FC = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { id } = useTransactionDetailsContext();
  const refetchQuery = useQueryRefetch();
  const { hasSufficientNativeBalance } = useNewTransactionContext();

  const { data: executeTransactionConfig } = useSimulateEscrowUniversalExecuteTransaction({
    args: [BigInt(id)],
  });

  const { writeContractAsync: executeTransaction } = useWriteEscrowUniversalExecuteTransaction(executeTransactionConfig);

  const handleExecuteTransaction = () => {
    if (!isUndefined(executeTransaction)) {
      setIsSending(true);
      wrapWithToast(async () => await executeTransaction(executeTransactionConfig.request), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
          } else {
            setIsSending(false);
          }
        })
        .catch((error) => {
          console.error("Error executing transaction:", error);
          setIsSending(false);
        });
    }
  };

  return (
    <Button
      isLoading={isSending}
      disabled={isSending || !hasSufficientNativeBalance}
      text="Execute Transaction"
      onClick={handleExecuteTransaction}
    />
  );
};

export default ExecuteTransactionButton;
