import React, { useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, usePublicClient } from "wagmi";
import {
  useWriteEscrowUniversalPayArbitrationFeeByBuyer,
  useWriteEscrowUniversalPayArbitrationFeeBySeller,
  useSimulateEscrowUniversalPayArbitrationFeeByBuyer,
  useSimulateEscrowUniversalPayArbitrationFeeBySeller,
} from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useQueryRefetch } from "hooks/useQueryRefetch";

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
  const refetchQuery = useQueryRefetch();

  const { data: payArbitrationFeeByBuyerConfig, error: simulateBuyerError } =
    useSimulateEscrowUniversalPayArbitrationFeeByBuyer({
      args: [BigInt(id)],
      value: arbitrationCost,
    });

  const { data: payArbitrationFeeBySellerConfig, error: simulateSellerError } =
    useSimulateEscrowUniversalPayArbitrationFeeBySeller({
      args: [BigInt(id)],
      value: arbitrationCost,
    });

  const { writeContractAsync: payArbitrationFeeByBuyer } =
    useWriteEscrowUniversalPayArbitrationFeeByBuyer(payArbitrationFeeByBuyerConfig);
  const { writeContractAsync: payArbitrationFeeBySeller } = useWriteEscrowUniversalPayArbitrationFeeBySeller(
    payArbitrationFeeBySellerConfig
  );

  const handleRaiseDispute = () => {
    if (isBuyer) {
      if (simulateBuyerError) {
        console.log({simulateBuyerError});
        let errorMessage = "An error occurred during simulation.";
        if (simulateBuyerError.message.includes("insufficient funds")) {
          errorMessage = "You don't have enough balance to raise a dispute.";
        }
        // Use wrapWithToast to display the error
        wrapWithToast(() => Promise.reject(new Error(errorMessage)), publicClient);
        return;
      }

      if (isUndefined(payArbitrationFeeByBuyerConfig)) {
        console.log({ payArbitrationFeeByBuyerConfig });
        console.log({ simulateBuyerError });
        wrapWithToast(() => Promise.reject(new Error("Unable to prepare transaction.")), publicClient);
        return;
      }

      if (!isUndefined(payArbitrationFeeByBuyer)) {
        setIsSending(true);
        wrapWithToast(() => payArbitrationFeeByBuyer(payArbitrationFeeByBuyerConfig.request), publicClient)
          .then((wrapResult) => {
            setIsSending(false);
            if (wrapResult.status) {
              toggleModal && toggleModal();
              refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
            }
          })
          .catch((error) => {
            console.error("Error raising dispute as buyer:", error);
            setIsSending(false);
          });
      }
    } else {
      if (simulateSellerError) {
        let errorMessage = "An error occurred during simulation.";
        if (simulateSellerError.message.includes("insufficient funds")) {
          errorMessage = "You don't have enough balance to raise a dispute.";
        }
        wrapWithToast(() => Promise.reject(new Error(errorMessage)), publicClient);
        return;
      }

      if (isUndefined(payArbitrationFeeBySellerConfig)) {
        console.log({ payArbitrationFeeBySellerConfig });
        console.log({ simulateSellerError });
        wrapWithToast(() => Promise.reject(new Error("Unable to prepare transaction.")), publicClient);
        return;
      }

      if (!isUndefined(payArbitrationFeeBySeller)) {
        setIsSending(true);
        wrapWithToast(() => payArbitrationFeeBySeller(payArbitrationFeeBySellerConfig.request), publicClient)
          .then((wrapResult) => {
            setIsSending(false);
            if (wrapResult.status) {
              toggleModal && toggleModal();
              refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
            }
          })
          .catch((error) => {
            console.error("Error raising dispute as seller:", error);
            setIsSending(false);
          });
      }
    }
  };

  return <Button isLoading={isSending} disabled={isSending} text={buttonText} onClick={handleRaiseDispute} />;
};

export default RaiseDisputeButton;
