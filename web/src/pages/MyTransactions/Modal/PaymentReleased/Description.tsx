import React from "react";
import styled from "styled-components";
import { shortenAddress } from "utils/shortenAddress";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { StyledP } from "components/StyledTags";

const Container = styled.div`
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  text-align: center;
`;

const StyledEscrowConcluded = styled(StyledP)`
  margin: 0;
`;

const StyledThanks = styled(StyledP)`
  margin: 0;
  font-weight: 600;
`;

const Description: React.FC = () => {
  const { seller } = useTransactionDetailsContext();

  return (
    <Container>
      <StyledEscrowConcluded>
        Escrow concluded. The funds were released to {shortenAddress(seller)}.
      </StyledEscrowConcluded>
      <StyledThanks>Thanks for using Kleros Escrow.</StyledThanks>
    </Container>
  );
};
export default Description;
