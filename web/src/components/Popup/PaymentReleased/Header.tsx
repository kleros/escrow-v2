import React from "react";
import styled from "styled-components";

const StyledHeader = styled.h1`
  margin: 0;
  margin-bottom: 24px;
`;

const Header: React.FC = () => {
  return <StyledHeader>Full payment released: 250 DAI</StyledHeader>;
};
export default Header;
