import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import AmountField from "./AmountField";
import Token from "./Token";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  margin-bottom: ${responsiveSize(24, 18)};

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )}
`;

interface ITokenAndAmount {
  quantity: string;
  setQuantity: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
}

const TokenAndAmount: React.FC<ITokenAndAmount> = ({ quantity, setQuantity, token, setToken }) => {
  return (
    <Container>
      <AmountField quantity={quantity} setQuantity={setQuantity} />
      <Token token={token} setToken={setToken} />
    </Container>
  );
};
export default TokenAndAmount;
