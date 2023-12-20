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
`;

const Header: React.FC = () => {
  const { escrowTitle } = useNewTransactionContext();

  return (
    <Container>
      <StyledLabel>General Escrow #1</StyledLabel>
      <StyledHeader>{escrowTitle}</StyledHeader>
    </Container>
  );
};
export default Header;
