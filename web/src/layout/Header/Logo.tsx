import React from "react";
import styled from "styled-components";

import { hoverShortTransitionTiming } from "styles/commonStyles";

import { Link } from "react-router-dom";

import EscrowLogo from "svgs/header/escrow.svg";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const StyledEscrowLogo = styled(EscrowLogo)`
  ${hoverShortTransitionTiming}
  max-height: 48px;
  width: auto;

  &:hover {
    path {
      fill: ${({ theme }) => theme.white}BF;
    }
  }
`;

const Logo: React.FC = () => (
  <Container>
    {" "}
    <Link to={"/"}>
      <StyledEscrowLogo />
    </Link>
  </Container>
);

export default Logo;
