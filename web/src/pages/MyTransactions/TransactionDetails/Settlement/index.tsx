import React from "react";
import { StyledCard } from "components/PreviewCard";
import Header from "./Header";
import Timeline from "./Timeline";
import Buttons from "./Buttons";

const Settlement: React.FC = () => {
  return (
    <StyledCard>
      <Header />
      <Timeline />
      <Buttons />
    </StyledCard>
  );
};
export default Settlement;
