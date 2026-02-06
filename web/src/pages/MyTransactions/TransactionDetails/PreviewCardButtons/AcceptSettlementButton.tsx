import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import {
  useSimulateEscrowUniversalAcceptSettlement,
  useWriteEscrowUniversalAcceptSettlement,
} from "hooks/contracts/generated";
import { useQueryRefetch } from "hooks/useQueryRefetch";

const AcceptButton: React.FC = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { id } = useTransactionDetailsContext();
  const refetchQuery = useQueryRefetch();

  const {
    data: acceptSettlementConfig,
    isLoading,
    isError,
  } = useSimulateEscrowUniversalAcceptSettlement({
    args: [BigInt(id)],
  });

  const { writeContractAsync: acceptSettlement } = useWriteEscrowUniversalAcceptSettlement(acceptSettlementConfig);

  const handleAcceptSettlement = () => {
    if (!isUndefined(acceptSettlement)) {
      setIsSending(true);
      wrapWithToast(async () => await acceptSettlement(acceptSettlementConfig.request), publicClient)
        .then((wrapResult) => {
          if (!wrapResult.status) {
            setIsSending(false);
          }
          refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
        })
        .catch((error) => {
          console.error("Error raising dispute as buyer:", error);
          setIsSending(false);
        });
    }
  };

  return (
    <Button
      isLoading={isSending || isLoading}
      isDisabled={isSending || isLoading || isError}
      text="Accept"
      onPress={handleAcceptSettlement}
    />
  );
};

export default AcceptButton;
