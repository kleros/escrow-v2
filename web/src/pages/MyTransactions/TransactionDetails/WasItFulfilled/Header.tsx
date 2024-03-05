import React from "react";
import styled from "styled-components";

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  font-weight: 600;
  margin: 0;
`;

const Header: React.FC = () => {
  return <StyledP>Was the agreement fulfilled?</StyledP>;
};
export default Header;
