import React from "react";
import { StyledCard } from "components/PreviewCard";
import Header from "../Header";
import Timeline from "./Timeline";
import Buttons from "./Buttons";

const Dispute: React.FC = () => {
  return (
    <StyledCard>
      <Header text="Dispute" />
      <Timeline />
      <Buttons />
    </StyledCard>
  );
};
export default Dispute;
