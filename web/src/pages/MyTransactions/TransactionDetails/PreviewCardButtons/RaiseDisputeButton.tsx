import React, { useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, usePublicClient } from "wagmi";
import {
  useEscrowPayArbitrationFeeByBuyer,
  useEscrowPayArbitrationFeeBySeller,
  usePrepareEscrowPayArbitrationFeeByBuyer,
  usePrepareEscrowPayArbitrationFeeBySeller,
} from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

interface IRaiseDisputeButton {
  toggleModal?: () => void;
  buttonText: string;
  arbitrationCost: bigint;
}

const RaiseDisputeButton: React.FC<IRaiseDisputeButton> = ({ toggleModal, buttonText, arbitrationCost }) => {
  const { address } = useAccount();
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { buyer, id } = useTransactionDetailsContext();
  const isBuyer = useMemo(() => address?.toLowerCase() === buyer?.toLowerCase(), [address, buyer]);

  const { config: payArbitrationFeeByBuyerConfig } = usePrepareEscrowPayArbitrationFeeByBuyer({
    args: [BigInt(id)],
    value: arbitrationCost,
  });

  const { config: payArbitrationFeeBySellerConfig } = usePrepareEscrowPayArbitrationFeeBySeller({
    args: [BigInt(id)],
    value: arbitrationCost,
  });

  const { writeAsync: payArbitrationFeeByBuyer } = useEscrowPayArbitrationFeeByBuyer(payArbitrationFeeByBuyerConfig);
  const { writeAsync: payArbitrationFeeBySeller } = useEscrowPayArbitrationFeeBySeller(payArbitrationFeeBySellerConfig);

  const handleRaiseDispute = () => {
    if (isBuyer && !isUndefined(payArbitrationFeeByBuyer)) {
      setIsSending(true);
      wrapWithToast(async () => await payArbitrationFeeByBuyer().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status && toggleModal) {
            toggleModal();
          } else if (wrapResult.status) {
          } else {
            setIsSending(false);
          }
        })
        .catch((error) => {
          console.error("Error raising dispute as buyer:", error);
          setIsSending(false);
        });
    } else if (!isBuyer && !isUndefined(payArbitrationFeeBySeller)) {
      setIsSending(true);
      wrapWithToast(async () => await payArbitrationFeeBySeller().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status && toggleModal) {
            toggleModal();
          } else if (wrapResult.status) {
          } else {
            setIsSending(false);
          }
        })
        .catch((error) => {
          console.error("Error raising dispute as seller:", error);
          setIsSending(false);
        });
    }
  };

  return <Button isLoading={isSending} disabled={isSending} text={buttonText} onClick={handleRaiseDispute} />;
};

export default RaiseDisputeButton;
