import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useEscrowAcceptSettlement, usePrepareEscrowAcceptSettlement } from "hooks/contracts/generated";

interface IAcceptButon {
  toggleModal?: () => void;
}

const AcceptButon: React.FC<IAcceptButon> = ({ toggleModal }) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { id } = useTransactionDetailsContext();

  const { config: acceptSettlementConfig } = usePrepareEscrowAcceptSettlement({
    args: [BigInt(id)],
  });

  const { writeAsync: acceptSettlement } = useEscrowAcceptSettlement(acceptSettlementConfig);

  const handleAcceptSettlement = () => {
    if (!isUndefined(acceptSettlement)) {
      setIsSending(true);
      wrapWithToast(async () => await acceptSettlement().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status && toggleModal) {
            toggleModal();
          }
        })
        .catch((error) => {
          console.error("Error raising dispute as buyer:", error);
          setIsSending(false);
        });
    }
  };

  return <Button isLoading={isSending} disabled={isSending} text="Accept" onClick={handleAcceptSettlement} />;
};

export default AcceptButon;
