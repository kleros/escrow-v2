import React from "react";

import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { StyledH1 } from "components/StyledTags";

const Container = styled(StyledH1)`
  margin-bottom: 20px;
  width: 84vw;
  text-align: center;
  font-size: ${responsiveSize(20, 24)};

  ${landscapeStyle(
    () => css`
      width: auto;
      margin-bottom: 29px;
    `
  )}
`;

interface IHeader {
  text: string;
}

const Header: React.FC<IHeader> = ({ text }) => {
  return <Container>{text}</Container>;
};
export default Header;
