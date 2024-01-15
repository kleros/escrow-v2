import React from "react";
import { StyledCard } from "components/PreviewCard";
import Header from "../Header";
import Timeline from "./Timeline";
import Buttons from "./Buttons";
import { TransactionDetailsFragment } from "src/graphql/graphql";

interface ISettlement {
  transactionData: TransactionDetailsFragment;
}

const Settlement: React.FC<ISettlement> = ({ transactionData }) => {
  return (
    <StyledCard>
      <Header text="How much should be paid?" />
      <Timeline transactionData={transactionData} />
      <Buttons transactionData={transactionData} />
    </StyledCard>
  );
};
export default Settlement;
