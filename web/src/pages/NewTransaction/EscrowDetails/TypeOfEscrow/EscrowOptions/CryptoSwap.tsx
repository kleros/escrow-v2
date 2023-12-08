import React from "react";
import styled from "styled-components";
import Logo from "tsx:svgs/icons/crypto-swap.svg";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { StyledCard } from ".";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
  justify-content: center;
`;

const StyledLogo = styled(Logo)`
  path {
    fill: ${({ theme }) => theme.secondaryPurple};
  }
`;

const Title = styled.p`
  display: flex;
  width: 100%;
  width: 96px;
  text-align: center;
  margin: 0;
  padding: 0 8px;
  flex-wrap: wrap;
`;

const CryptoSwap: React.FC = () => {
  const { escrowType, setEscrowType } = useNewTransactionContext();

  const handleSelect = () => {
    setEscrowType("swap");
  };

  return (
    <Container>
      <StyledCard onClick={handleSelect} selected={escrowType === "swap"}>
        <StyledLogo />
      </StyledCard>
      <Title>Crypto Swap</Title>
    </Container>
  );
};
export default CryptoSwap;
