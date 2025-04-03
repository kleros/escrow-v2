import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { StyledH1 } from "components/StyledTags";

const StyledHeader = styled(StyledH1)`
  margin: 0;
  color: ${({ theme }) => theme.secondaryPurple};
  font-weight: 400;
  margin-bottom: ${responsiveSize(20, 24)};
  margin-top: ${responsiveSize(4, 20)};
  font-size: ${responsiveSize(20, 24)};
`;

const Header: React.FC = () => {
  return <StyledHeader>Preview</StyledHeader>;
};
export default Header;
