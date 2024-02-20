import React from "react";
import styled from "styled-components";

const StyledHeader = styled.h1`
  margin: 0;
`;

interface IHeader {
  text: string;
}

const Header: React.FC<IHeader> = ({ text }) => {
  return <StyledHeader>{text}</StyledHeader>;
};
export default Header;
