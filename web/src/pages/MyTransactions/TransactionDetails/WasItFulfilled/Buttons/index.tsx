import React from "react";
import OpenModalProposeSettlementButton from "./OpenModalProposeSettlementButton";
import ReleasePaymentButton from "./ReleasePaymentButton";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import ClaimFullPaymentButton from "./ClaimFullPaymentButton";

const Buttons: React.FC = () => {
  const { address } = useAccount();
  const { buyer, payments, deadline } = useTransactionDetailsContext();
  const isBuyer = address?.toLowerCase() === buyer?.toLowerCase();
  const currentTimeUnixSeconds = Math.floor(Date.now() / 1000);

  return (
    <div className="flex flex-wrap justify-center gap-y-4 gap-x-6 mb-8">
      {isBuyer && payments?.length === 0 ? <ReleasePaymentButton /> : null}
      {currentTimeUnixSeconds < deadline ? (
        <OpenModalProposeSettlementButton buttonText="Propose a settlement" />
      ) : null}
      {currentTimeUnixSeconds > deadline && !isBuyer ? <ClaimFullPaymentButton /> : null}
    </div>
  );
};
export default Buttons;
