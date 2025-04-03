import React from "react";
import styled from "styled-components";
import { StyledH1 } from "components/StyledTags";

const Container = styled(StyledH1)`
  margin: 0;
`;

interface IHeader {
  text: string;
}

const Header: React.FC<IHeader> = ({ text }) => {
  return <Container>{text}</Container>;
};
export default Header;
