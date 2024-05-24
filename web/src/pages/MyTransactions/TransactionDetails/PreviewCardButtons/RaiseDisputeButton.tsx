import React, { useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, usePublicClient } from "wagmi";
import {
  useEscrowUniversalPayArbitrationFeeByBuyer,
  useEscrowUniversalPayArbitrationFeeBySeller,
  usePrepareEscrowUniversalPayArbitrationFeeByBuyer,
  usePrepareEscrowUniversalPayArbitrationFeeBySeller,
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

  const { config: payArbitrationFeeByBuyerConfig } = usePrepareEscrowUniversalPayArbitrationFeeByBuyer({
    args: [BigInt(id)],
    value: arbitrationCost,
  });

  const { config: payArbitrationFeeBySellerConfig } = usePrepareEscrowUniversalPayArbitrationFeeBySeller({
    args: [BigInt(id)],
    value: arbitrationCost,
  });

  const { writeAsync: payArbitrationFeeByBuyer } =
    useEscrowUniversalPayArbitrationFeeByBuyer(payArbitrationFeeByBuyerConfig);
  const { writeAsync: payArbitrationFeeBySeller } = useEscrowUniversalPayArbitrationFeeBySeller(
    payArbitrationFeeBySellerConfig
  );

  const handleRaiseDispute = () => {
    if (isBuyer && !isUndefined(payArbitrationFeeByBuyer)) {
      setIsSending(true);
      wrapWithToast(async () => await payArbitrationFeeByBuyer().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            toggleModal && toggleModal();
            refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
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
          if (wrapResult.status) {
            toggleModal && toggleModal();
            refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
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
