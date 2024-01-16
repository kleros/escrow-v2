import React from "react";
import styled from "styled-components";
import { shortenAddress } from "utils/shortenAddress";

const Container = styled.div`
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  text-align: center;
`;

const StyledEscrowConcluded = styled.p`
  margin: 0;
`;

const StyledThanks = styled.p`
  margin: 0;
  font-weight: 600;
`;

interface IDescription {
  seller: string;
}

const Description: React.FC<IDescription> = ({ seller }) => {
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
