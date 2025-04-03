import React from "react";
import styled from "styled-components";
import { StyledH1 } from "components/StyledTags";

const StyledHeader = styled(StyledH1)`
  margin: 0;
`;

const Header: React.FC = () => {
  return <StyledHeader>Raise a dispute</StyledHeader>;
};
export default Header;
