import React from "react";
import { StyledCard } from "components/PreviewCard";
import Header from "../Header";
import Timeline from "./Timeline";
import Buttons from "./Buttons";

interface IDispute {
  disputeID: string;
}

const Dispute: React.FC<IDispute> = ({ disputeID }) => {
  return (
    <StyledCard>
      <Header text="Dispute" />
      <Timeline />
      <Buttons disputeID={disputeID} />
    </StyledCard>
  );
};
export default Dispute;
