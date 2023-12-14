import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";

const StyledHeader = styled.h1`
  display: flex;
  margin: 0;
  color: ${({ theme }) => theme.secondaryPurple};
  font-weight: 400;
  margin-bottom: 48px;
  margin-top: ${responsiveSize(4, 20)};
`;

const Header: React.FC = () => {
  return <StyledHeader>Preview</StyledHeader>;
};
export default Header;
