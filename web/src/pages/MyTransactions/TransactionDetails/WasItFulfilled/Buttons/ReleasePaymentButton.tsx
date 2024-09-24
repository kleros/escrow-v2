import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import PaymentReleased from "pages/MyTransactions/Modal/PaymentReleased";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { useWriteEscrowUniversalPay, useSimulateEscrowUniversalPay } from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { usePublicClient } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useQueryRefetch } from "hooks/useQueryRefetch";

const ReleasePaymentButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { id, amount } = useTransactionDetailsContext();
  const refetchQuery = useQueryRefetch();
  const { hasSufficientNativeBalance } = useNewTransactionContext();

  const { data: releaseFullPaymentConfig } = useSimulateEscrowUniversalPay({
    args: [id, amount],
  });

  const { writeContractAsync: releaseFullPayment } = useWriteEscrowUniversalPay(releaseFullPaymentConfig);

  const handleReleasePayment = () => {
    if (!isUndefined(releaseFullPayment)) {
      setIsSending(true);
      wrapWithToast(async () => await releaseFullPayment(releaseFullPaymentConfig.request), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            toggleModal();
            refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
          }
        })
        .catch((error) => {
          console.error("Failed to release payment:", error);
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
        text={"Yes. Release full payment"}
        onClick={handleReleasePayment}
      />
      {isModalOpen ? <PaymentReleased toggleModal={toggleModal} /> : null}
    </>
  );
};
export default ReleasePaymentButton;
