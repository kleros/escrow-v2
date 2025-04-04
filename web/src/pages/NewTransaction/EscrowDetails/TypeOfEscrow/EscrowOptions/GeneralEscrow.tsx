import React from "react";
import styled from "styled-components";
import Logo from "svgs/icons/general-escrow.svg";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { StyledCard } from ".";
import { StyledP } from "components/StyledTags";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

const StyledLogo = styled(Logo)`
  path {
    fill: ${({ theme }) => theme.secondaryPurple};
  }
`;

const Title = styled(StyledP)`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  width: 96px;
  text-align: center;
  margin: 0;
`;

const GeneralEscrow: React.FC = () => {
  const { escrowType, setEscrowType } = useNewTransactionContext();

  const handleSelect = () => {
    setEscrowType("general");
  };

  return (
    <Container>
      <StyledCard onClick={handleSelect} selected={escrowType === "general"}>
        <StyledLogo />
      </StyledCard>
      <Title>General Escrow</Title>
    </Container>
  );
};
export default GeneralEscrow;
