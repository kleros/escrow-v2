import React from "react";
import styled from "styled-components";
import LawBalance from "svgs/icons/law-balance.svg";

const StyledCheckCircle = styled(LawBalance)`
  path {
    fill: ${({ theme }) => theme.secondaryPurple};
  }
`;

const LawBalanceIcon: React.FC = () => {
  return <StyledCheckCircle />;
};
export default LawBalanceIcon;
