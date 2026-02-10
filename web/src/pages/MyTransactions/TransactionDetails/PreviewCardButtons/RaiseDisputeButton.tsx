import React, { useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, useBalance, usePublicClient } from "wagmi";
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
import ClosedCircle from "svgs/icons/close-circle.svg";

interface IRaiseDisputeButton {
  toggleModal?: () => void;
  buttonText: string;
  arbitrationCost: bigint;
}

const RaiseDisputeButton: React.FC<IRaiseDisputeButton> = ({ toggleModal, buttonText, arbitrationCost }) => {
  const { address } = useAccount();
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { buyer, seller, id } = useTransactionDetailsContext();
  const isBuyer = useMemo(() => address?.toLowerCase() === buyer?.toLowerCase(), [address, buyer]);
  const isSeller = useMemo(() => address?.toLowerCase() === seller?.toLowerCase(), [address, seller]);
  const refetchQuery = useQueryRefetch();

  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  const insufficientBalance = useMemo(() => {
    return balanceData && BigInt(arbitrationCost.toString()) > BigInt(balanceData.value.toString());
  }, [arbitrationCost, balanceData]);

  const {
    data: payArbitrationFeeByBuyerConfig,
    isLoading: isLoadingBuyerConfig,
    isError: isErrorBuyerConfig,
  } = useSimulateEscrowUniversalPayArbitrationFeeByBuyer({
    query: {
      enabled: isBuyer && !insufficientBalance,
    },
    args: [BigInt(id)],
    value: arbitrationCost,
  });

  const {
    data: payArbitrationFeeBySellerConfig,
    isLoading: isLoadingSellerConfig,
    isError: isErrorSellerConfig,
  } = useSimulateEscrowUniversalPayArbitrationFeeBySeller({
    query: {
      enabled: isSeller && !insufficientBalance,
    },
    args: [BigInt(id)],
    value: arbitrationCost,
  });

  const { writeContractAsync: payArbitrationFeeByBuyer } =
    useWriteEscrowUniversalPayArbitrationFeeByBuyer(payArbitrationFeeByBuyerConfig);
  const { writeContractAsync: payArbitrationFeeBySeller } = useWriteEscrowUniversalPayArbitrationFeeBySeller(
    payArbitrationFeeBySellerConfig
  );

  const handleRaiseDispute = () => {
    if (isBuyer && !isUndefined(payArbitrationFeeByBuyer)) {
      setIsSending(true);
      wrapWithToast(async () => await payArbitrationFeeByBuyer(payArbitrationFeeByBuyerConfig.request), publicClient)
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
    } else if (isSeller && !isUndefined(payArbitrationFeeBySeller)) {
      setIsSending(true);
      wrapWithToast(async () => await payArbitrationFeeBySeller(payArbitrationFeeBySellerConfig.request), publicClient)
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

  return (
    <div>
      <Button
        isLoading={!insufficientBalance && (isSending || isLoadingBuyerConfig || isLoadingSellerConfig)}
        isDisabled={
          isSending ||
          insufficientBalance ||
          isLoadingBuyerConfig ||
          isLoadingSellerConfig ||
          isErrorBuyerConfig ||
          isErrorSellerConfig
        }
        text={buttonText}
        onPress={handleRaiseDispute}
      />
      {insufficientBalance && (
        <div className="flex items-center justify-center gap-1 m-3 text-sm text-klerosUIComponentsError">
          <ClosedCircle className="fill-klerosUIComponentsError" /> Insufficient balance
        </div>
      )}
    </div>
  );
};

export default RaiseDisputeButton;
