import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import PaymentReleased from "pages/MyTransactions/Modal/PaymentReleased";
import { useNewTransactionContext } from "context/NewTransactionContext";
import {
  useWriteEscrowUniversalExecuteTransaction,
  useSimulateEscrowUniversalExecuteTransaction,
} from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { usePublicClient } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const ClaimFullPaymentButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { id } = useTransactionDetailsContext();
  const { hasSufficientNativeBalance } = useNewTransactionContext();

  const { data: executeTransactionConfig } = useSimulateEscrowUniversalExecuteTransaction({
    args: [id],
  });

  const { writeContractAsync: executeTransaction } = useWriteEscrowUniversalExecuteTransaction(executeTransactionConfig);

  const handleExecuteTransaction = () => {
    if (!isUndefined(executeTransaction)) {
      setIsSending(true);
      wrapWithToast(async () => await executeTransaction(executeTransactionConfig.request), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            toggleModal();
          } else {
            setIsSending(false);
          }
        })
        .catch((error) => {
          console.error("Failed to claim payment:", error);
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  return (
    <>
      <Button
        isLoading={isSending}
        disabled={isSending || !hasSufficientNativeBalance}
        text={"No. Claim full payment"}
        onClick={handleExecuteTransaction}
      />
      {isModalOpen ? <PaymentReleased toggleModal={toggleModal} /> : null}
    </>
  );
};
export default ClaimFullPaymentButton;
