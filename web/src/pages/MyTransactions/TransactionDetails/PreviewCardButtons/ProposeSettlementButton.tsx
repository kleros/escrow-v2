import React, { useMemo, useState } from "react";
import { Button } from "@kleros/ui-components-library";
import { usePublicClient } from "wagmi";
import { parseUnits } from "viem";
import { isUndefined } from "utils/index";
import { wrapWithToast } from "utils/wrapWithToast";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useTokenMetadata } from "hooks/useTokenMetadata";
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
  const { id, token } = useTransactionDetailsContext();
  const { tokenMetadata } = useTokenMetadata(token);
  const tokenDecimals = tokenMetadata?.decimals;
  const isDecimalsLoading = !!token && tokenMetadata === undefined;
  const isDecimalsError = !!token && tokenMetadata === null;
  const isDecimalsMissing = !!token && !!tokenMetadata && tokenDecimals === undefined;
  const refetchQuery = useQueryRefetch();

  const parsedAmountProposed = useMemo(() => {
    if (!amountProposed) return 0n;
    return parseUnits(amountProposed, tokenDecimals ?? 18);
  }, [amountProposed, tokenDecimals]);

  const {
    data: proposeSettlementConfig,
    isLoading,
    isError,
  } = useSimulateEscrowUniversalProposeSettlement({
    args: [BigInt(id), parsedAmountProposed],
  });

  const { writeContractAsync: proposeSettlement } = useWriteEscrowUniversalProposeSettlement(proposeSettlementConfig);

  const handleProposeSettlement = () => {
    if (!isUndefined(proposeSettlement) && proposeSettlementConfig && publicClient) {
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
      isLoading={isSending || isLoading}
      isDisabled={isSending || !isAmountValid || isLoading || isError || isDecimalsLoading || isDecimalsError || isDecimalsMissing}
      text={buttonText}
      onPress={handleProposeSettlement}
    />
  );
};

export default ProposeSettlementButton;
