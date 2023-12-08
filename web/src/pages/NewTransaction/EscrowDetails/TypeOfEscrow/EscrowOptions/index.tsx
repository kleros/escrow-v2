import React from "react";
import styled, { css } from "styled-components";
import GeneralEscrow from "./GeneralEscrow";
import CryptoSwap from "./CryptoSwap";
import { Card } from "@kleros/ui-components-library";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
  margin-bottom: 32px;
`;

export const StyledCard = styled(Card)<{ selected: boolean }>`
  display: flex;
  height: 96px;
  width: 96px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  ${({ selected, theme }) =>
    selected &&
    css`
      border: 1px solid ${theme.primaryBlue};
    `}
`;

const EscrowOptions: React.FC = () => {
  return (
    <Container>
      <GeneralEscrow />
      <CryptoSwap />
    </Container>
  );
};
export default EscrowOptions;
