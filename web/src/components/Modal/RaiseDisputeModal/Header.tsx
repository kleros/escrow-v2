import React from "react";
import styled from "styled-components";

const StyledHeader = styled.h1`
  margin: 0;
`;

const Header: React.FC = () => {
  return <StyledHeader>Raise a dispute</StyledHeader>;
};
export default Header;
