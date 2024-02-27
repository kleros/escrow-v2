import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { useAccount, usePublicClient } from "wagmi";
import {
  useEscrowTimeOutByBuyer,
  useEscrowTimeOutBySeller,
  usePrepareEscrowTimeOutByBuyer,
  usePrepareEscrowTimeOutBySeller,
} from "hooks/contracts/generated";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const TimeOutButton: React.FC = () => {
  const { address } = useAccount();
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { buyer, id } = useTransactionDetailsContext();
  const isBuyer = address?.toLowerCase() === buyer?.toLowerCase();

  const { config: timeOutByBuyerConfig } = usePrepareEscrowTimeOutByBuyer({
    args: [BigInt(id)],
  });

  const { config: timeOutBySellerConfig } = usePrepareEscrowTimeOutBySeller({
    args: [BigInt(id)],
  });

  const { writeAsync: timeOutByBuyer } = useEscrowTimeOutByBuyer(timeOutByBuyerConfig);
  const { writeAsync: timeOutBySeller } = useEscrowTimeOutBySeller(timeOutBySellerConfig);

  const handleTimeout = () => {
    if (isBuyer && !isUndefined(timeOutByBuyer)) {
      setIsSending(true);
      wrapWithToast(async () => await timeOutByBuyer().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (!wrapResult.status) {
            setIsSending(false);
          }
        })
        .catch((error) => {
          console.error("Error timing out as buyer:", error);
          setIsSending(false);
        });
    } else if (!isBuyer && !isUndefined(timeOutBySeller)) {
      setIsSending(true);
      wrapWithToast(async () => await timeOutBySeller().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (!wrapResult.status) {
            setIsSending(false);
          }
        })
        .catch((error) => {
          console.error("Error timing out as seller:", error);
          setIsSending(false);
        });
    }
  };

  return <Button isLoading={isSending} disabled={isSending} text="Claim full payment back" onClick={handleTimeout} />;
};

export default TimeOutButton;
