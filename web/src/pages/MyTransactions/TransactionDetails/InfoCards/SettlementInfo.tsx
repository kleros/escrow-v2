import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

interface ISettlementInfo {
  pendingParty: string;
}

const SettlementInfo: React.FC<ISettlementInfo> = ({ pendingParty }) => {
  const { address } = useAccount();
  const { seller, buyer } = useTransactionDetailsContext();

  const isBuyerConnected = address?.toLowerCase() === buyer;
  const isSellerConnected = address?.toLowerCase() === seller;
  const message =
    (pendingParty === "buyer" && isBuyerConnected) || (pendingParty === "seller" && isSellerConnected)
      ? "You can accept the proposal, counter-propose, or raise a dispute."
      : "Wait for the other party to answer. If the other party takes too long," +
        " you will be able to raise a dispute.";

  return (
    <AlertMessage
      variant="info"
      title={`The ${pendingParty === "seller" ? "Buyer" : "Seller"} proposed a settlement`}
      msg={message}
    />
  );
};

export default SettlementInfo;
