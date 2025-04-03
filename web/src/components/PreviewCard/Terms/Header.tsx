import React from "react";
import styled from "styled-components";
import { StyledH3 } from "components/StyledTags";

const StyledHeader = styled(StyledH3)`
  margin-bottom: 0;
`;

const Header: React.FC = () => {
  return <StyledHeader>Terms</StyledHeader>;
};
export default Header;
