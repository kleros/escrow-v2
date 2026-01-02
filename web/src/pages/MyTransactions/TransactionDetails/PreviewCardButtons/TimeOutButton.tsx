import React, { useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, usePublicClient } from "wagmi";
import {
  useWriteEscrowUniversalTimeOutByBuyer,
  useWriteEscrowUniversalTimeOutBySeller,
  useSimulateEscrowUniversalTimeOutByBuyer,
  useSimulateEscrowUniversalTimeOutBySeller,
} from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useQueryRefetch } from "hooks/useQueryRefetch";

const TimeOutButton: React.FC = () => {
  const { address } = useAccount();
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { buyer, id } = useTransactionDetailsContext();
  const isBuyer = useMemo(() => address?.toLowerCase() === buyer?.toLowerCase(), [address, buyer]);
  const refetchQuery = useQueryRefetch();

  const {
    data: timeOutByBuyerConfig,
    isLoading: isLoadingBuyerConfig,
    isError: isErrorBuyerConfig,
  } = useSimulateEscrowUniversalTimeOutByBuyer({
    args: [BigInt(id)],
  });

  const {
    data: timeOutBySellerConfig,
    isLoading: isLoadingSellerConfig,
    isError: isErrorSellerConfig,
  } = useSimulateEscrowUniversalTimeOutBySeller({
    args: [BigInt(id)],
  });

  const { writeContractAsync: timeOutByBuyer } = useWriteEscrowUniversalTimeOutByBuyer(timeOutByBuyerConfig);
  const { writeContractAsync: timeOutBySeller } = useWriteEscrowUniversalTimeOutBySeller(timeOutBySellerConfig);

  const handleTimeout = () => {
    if (isBuyer && !isUndefined(timeOutByBuyer)) {
      setIsSending(true);
      wrapWithToast(async () => await timeOutByBuyer(timeOutByBuyerConfig.request), publicClient)
        .then((wrapResult) => {
          if (!wrapResult.status) {
            setIsSending(false);
            refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
          }
        })
        .catch((error) => {
          console.error("Error timing out as buyer:", error);
          setIsSending(false);
        });
    } else if (!isBuyer && !isUndefined(timeOutBySeller)) {
      setIsSending(true);
      wrapWithToast(async () => await timeOutBySeller(timeOutBySellerConfig.request), publicClient)
        .then((wrapResult) => {
          if (!wrapResult.status) {
            setIsSending(false);
            refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
          }
        })
        .catch((error) => {
          console.error("Error timing out as seller:", error);
          setIsSending(false);
        });
    }
  };

  return (
    <Button
      isLoading={isSending || isLoadingBuyerConfig || isLoadingSellerConfig}
      isDisabled={
        isSending || isLoadingBuyerConfig || isLoadingSellerConfig || isErrorBuyerConfig || isErrorSellerConfig
      }
      text="Claim full payment back"
      onPress={handleTimeout}
    />
  );
};

export default TimeOutButton;
