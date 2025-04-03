import React from "react";
import styled from "styled-components";
import { StyledP as P } from "components/StyledTags";

const StyledP = styled(P)`
  font-size: 14px;
  margin: 0;
`;

const Header: React.FC = () => {
  return <StyledP>Amount Claimed</StyledP>;
};
export default Header;
