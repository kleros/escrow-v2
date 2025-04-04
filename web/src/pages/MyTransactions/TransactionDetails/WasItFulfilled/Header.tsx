import React from "react";
import styled from "styled-components";
import { StyledP as P } from "components/StyledTags";

const StyledP = styled(P)`
  color: ${({ theme }) => theme.primaryBlue};
  font-weight: 600;
  margin: 0;
`;

const Header: React.FC = () => {
  return <StyledP>Was the agreement fulfilled?</StyledP>;
};
export default Header;
