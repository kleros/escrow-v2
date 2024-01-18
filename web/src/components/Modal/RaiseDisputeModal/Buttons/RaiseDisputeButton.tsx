import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, usePublicClient } from "wagmi";
import {
  useEscrowPayArbitrationFeeByBuyer,
  useEscrowPayArbitrationFeeBySeller,
  usePrepareEscrowPayArbitrationFeeByBuyer,
  usePrepareEscrowPayArbitrationFeeBySeller,
} from "hooks/contracts/generated";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";

interface IRaiseDisputeButton {
  transactionData: TransactionDetailsFragment;
  toggleModal: () => void;
}

const RaiseDisputeButton: React.FC<IRaiseDisputeButton> = ({ transactionData, toggleModal }) => {
  const { address } = useAccount();
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const isBuyer = address?.toLowerCase() === transactionData?.buyer?.toLowerCase();

  /* IMPORTANT: arbitration cost is hardcoded for now. need to figure out a way to dynamically fetch
  the actual arbitrationCost from the KlerosCore contract */
  const arbitrationCost = BigInt("30000000000000");

  const { config: payArbitrationFeeByBuyerConfig } = usePrepareEscrowPayArbitrationFeeByBuyer({
    args: [BigInt(transactionData?.id)],
    value: arbitrationCost,
  });

  const { config: payArbitrationFeeBySellerConfig } = usePrepareEscrowPayArbitrationFeeBySeller({
    args: [BigInt(transactionData?.id)],
    value: arbitrationCost,
  });

  const { writeAsync: payArbitrationFeeByBuyer } = useEscrowPayArbitrationFeeByBuyer(payArbitrationFeeByBuyerConfig);
  const { writeAsync: payArbitrationFeeBySeller } = useEscrowPayArbitrationFeeBySeller(payArbitrationFeeBySellerConfig);

  const handleRaiseDispute = () => {
    if (isBuyer && !isUndefined(payArbitrationFeeByBuyer)) {
      setIsSending(true);
      wrapWithToast(async () => await payArbitrationFeeByBuyer().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            toggleModal();
          }
        })
        .catch((error) => {
          console.error("Error raising dispute as buyer:", error);
        })
        .finally(() => {
          setIsSending(false);
        });
    } else if (!isBuyer && !isUndefined(payArbitrationFeeBySeller)) {
      setIsSending(true);
      wrapWithToast(async () => await payArbitrationFeeBySeller().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            toggleModal();
          }
        })
        .catch((error) => {
          console.error("Error raising dispute as seller:", error);
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  return (
    <Button
      isLoading={isSending}
      disabled={isSending}
      variant="secondary"
      text="Raise a dispute"
      onClick={handleRaiseDispute}
    />
  );
};

export default RaiseDisputeButton;
