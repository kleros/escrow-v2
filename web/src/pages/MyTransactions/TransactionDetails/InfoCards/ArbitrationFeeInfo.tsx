import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

interface IArbitrationFeeInfo {
  pendingParty: string;
}

const ArbitrationFeeInfo: React.FC<IArbitrationFeeInfo> = ({ pendingParty }) => {
  const { address } = useAccount();
  const { seller, buyer } = useTransactionDetailsContext();

  const isBuyerConnected = address?.toLowerCase() === buyer;
  const isSellerConnected = address?.toLowerCase() === seller;
  const variant =
    (pendingParty === "buyer" && isBuyerConnected) || (pendingParty === "seller" && isSellerConnected)
      ? "warning"
      : "info";

  return (
    <AlertMessage
      variant={variant}
      title={`The ${
        pendingParty === "buyer" ? "Buyer" : "Seller"
      } needs to deposit the fee in time not to lose the escrow`}
      msg={
        pendingParty === "buyer"
          ? "In case the buyer fails to deposit the arbitration fee in time, " +
            "the seller will be able to claim the full payment + arbitration fee back."
          : "In case the seller fails to deposit the arbitration fee in time, " +
            "the buyer will be able to claim the full payment + arbitration fee back."
      }
    />
  );
};

export default ArbitrationFeeInfo;
