import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { calcMinMax } from "~src/utils/calcMinMax";
import AmountField from "./AmountField";
import Token from "./Token";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  margin-bottom: ${calcMinMax(24, 18)};

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )}
`;

const TokenAndAmount: React.FC = () => {
  return (
    <Container>
      <AmountField />
      <Token />
    </Container>
  );
};
export default TokenAndAmount;
