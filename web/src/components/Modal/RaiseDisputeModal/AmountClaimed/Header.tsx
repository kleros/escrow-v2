import React from "react";
import styled from "styled-components";

const StyledP = styled.p`
  font-size: 14px;
  margin: 0;
`;

const Header: React.FC = () => {
  return <StyledP>Amount Claimed</StyledP>;
};
export default Header;
