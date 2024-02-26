import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { parseEther } from "viem";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { usePrepareEscrowProposeSettlement, useEscrowProposeSettlement } from "hooks/contracts/generated";

interface IProposeSettlementButton {
  toggleModal?: () => void;
  buttonText: string;
  amountProposed: string;
}

const ProposeSettlementButton: React.FC<IProposeSettlementButton> = ({ toggleModal, buttonText, amountProposed }) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { id } = useTransactionDetailsContext();
  console.log(amountProposed);

  const { config: proposeSettlementConfig } = usePrepareEscrowProposeSettlement({
    args: [BigInt(id), parseEther(amountProposed)],
  });

  const { writeAsync: proposeSettlement } = useEscrowProposeSettlement(proposeSettlementConfig);

  const handleProposeSettlement = () => {
    if (!isUndefined(proposeSettlement)) {
      setIsSending(true);
      wrapWithToast(async () => await proposeSettlement().then((response) => response.hash), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status && toggleModal) {
            toggleModal();
          } else if (wrapResult.status) {
          } else {
            setIsSending(false);
          }
        })
        .catch((error) => {
          console.error("Error proposing settlement:", error);
          setIsSending(false);
        });
    }
  };

  return <Button isLoading={isSending} disabled={isSending} text={buttonText} onClick={handleProposeSettlement} />;
};

export default ProposeSettlementButton;
