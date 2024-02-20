import React from "react";
import styled from "styled-components";
import { isUndefined } from "utils/index";
import { StyledSkeleton } from "../StyledSkeleton";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.secondaryPurple};
`;

const StyledHeader = styled.h1`
  margin: 0;
  flex-wrap: wrap;
  word-break: break-word;
  width: 100%;
`;

interface IHeader {
  escrowType: string;
  escrowTitle?: string;
}

const Header: React.FC<IHeader> = ({ escrowType, escrowTitle }) => {
  return (
    <Container>
      <StyledLabel>{escrowType === "general" ? "General Escrow" : "Crypto Swap"}</StyledLabel>
      {isUndefined(escrowTitle) ? <StyledSkeleton /> : <StyledHeader>{escrowTitle}</StyledHeader>}
    </Container>
  );
};

export default Header;
