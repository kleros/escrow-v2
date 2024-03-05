import React from "react";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import ArbitrationFeeInfo from "./ArbitrationFeeInfo";
import DisputeInfo from "./DisputeInfo";
import SettlementInfo from "./SettlementInfo";

interface Iindex {}

const index: React.FC<Iindex> = ({}) => {
  const { status } = useTransactionDetailsContext();

  return (
    <>
      {status === "WaitingSettlementSeller" ? <SettlementInfo pendingParty="seller" /> : null}
      {status === "WaitingSettlementBuyer" ? <SettlementInfo pendingParty="buyer" /> : null}
      {status === "WaitingSeller" ? <ArbitrationFeeInfo pendingParty="seller" /> : null}
      {status === "WaitingBuyer" ? <ArbitrationFeeInfo pendingParty="buyer" /> : null}
      {status === "DisputeCreated" ? <DisputeInfo /> : null}
    </>
  );
};
export default index;
