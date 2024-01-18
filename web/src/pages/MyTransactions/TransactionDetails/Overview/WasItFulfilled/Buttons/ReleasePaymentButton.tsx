import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import PaymentReleased from "components/Popup/PaymentReleased";
import { useEscrowPay, usePrepareEscrowPay } from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { usePublicClient } from "wagmi";

interface IReleasePaymentButton {
  transactionId: string;
  amount: string;
  asset: string;
  seller: string;
}

const ReleasePaymentButton: React.FC<IReleasePaymentButton> = ({ transactionId, amount, asset, seller }) => {
  const [isModalOpen, toggleModal] = useToggle(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();

  const { config: releaseFullPaymentConfig } = usePrepareEscrowPay({
    args: [transactionId, amount],
  });

  const { writeAsync: releaseFullPayment } = useEscrowPay(releaseFullPaymentConfig);

  const handleReleasePayment = () => {
    if (!isUndefined(releaseFullPayment)) {
      setIsSending(true);
      wrapWithToast(async () => await releaseFullPayment().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            toggleModal();
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
        disabled={isSending}
        text={"Yes. Release full payment"}
        onClick={handleReleasePayment}
      />
      {isModalOpen ? <PaymentReleased toggleModal={toggleModal} seller={seller} asset={asset} amount={amount} /> : null}
    </>
  );
};
export default ReleasePaymentButton;
