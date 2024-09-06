import React, { useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { parseEther } from "viem";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import {
  useSimulateEscrowUniversalProposeSettlement,
  useWriteEscrowUniversalProposeSettlement,
} from "hooks/contracts/generated";
import { useQueryRefetch } from "hooks/useQueryRefetch";

interface IProposeSettlementButton {
  toggleModal?: () => void;
  buttonText: string;
  amountProposed: string;
  isAmountValid: boolean;
}

const ProposeSettlementButton: React.FC<IProposeSettlementButton> = ({
  toggleModal,
  buttonText,
  amountProposed,
  isAmountValid,
}) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { id } = useTransactionDetailsContext();
  const refetchQuery = useQueryRefetch();

  const { data: proposeSettlementConfig } = useSimulateEscrowUniversalProposeSettlement({
    args: [BigInt(id), parseEther(amountProposed)],
  });

  const { writeContractAsync: proposeSettlement } = useWriteEscrowUniversalProposeSettlement(proposeSettlementConfig);

  const handleProposeSettlement = () => {
    if (!isUndefined(proposeSettlement)) {
      setIsSending(true);
      wrapWithToast(async () => await proposeSettlement(proposeSettlementConfig.request), publicClient)
        .then((wrapResult) => {
          if (wrapResult.status) {
            toggleModal && toggleModal();
            refetchQuery([["refetchOnBlock", "useTransactionDetailsQuery"]]);
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

  return (
    <Button
      isLoading={isSending}
      disabled={isSending || !isAmountValid}
      text={buttonText}
      onClick={handleProposeSettlement}
    />
  );
};

export default ProposeSettlementButton;
