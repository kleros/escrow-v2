import React from "react";
import { StyledCard } from "components/PreviewCard";
import Header from "../Header";
import Timeline from "./Timeline";
import Buttons from "./Buttons";
import { TransactionDetailsFragment } from "~src/graphql/graphql";

interface IDispute {
  transactionData: TransactionDetailsFragment;
}

const Dispute: React.FC<IDispute> = ({ transactionData }) => {
  return (
    <StyledCard>
      <Header text="Dispute" />
      <Timeline transactionData={transactionData} />
      {transactionData?.disputeRequest ? (
        <Buttons disputeID={transactionData?.disputeRequest?.id} />
      ) : null}
    </StyledCard>
  );
};
export default Dispute;
