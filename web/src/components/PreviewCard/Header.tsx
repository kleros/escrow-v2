import React from "react";
import styled from "styled-components";
import { useNewTransactionContext } from "context/NewTransactionContext";

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

const Header: React.FC = () => {
  const { escrowType, escrowTitle } = useNewTransactionContext();

  return (
    <Container>
      <StyledLabel>{escrowType === "general" ? "General Escrow" : "Crypto Swap"}</StyledLabel>
      <StyledHeader>{escrowTitle}</StyledHeader>
    </Container>
  );
};

export default Header;
