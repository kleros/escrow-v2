import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import AmountField from "./AmountField";
import TokenSelector from "./TokenSelector";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;
  margin-bottom: ${responsiveSize(24, 18)};
  margin-left: 36px;
`;

interface ITokenAndAmount {
  quantity: string;
  setQuantity: (value: string) => void;
}

const TokenAndAmount: React.FC<ITokenAndAmount> = ({ quantity, setQuantity }) => {
  return (
    <Container>
      <AmountField quantity={quantity} setQuantity={setQuantity} />
      <TokenSelector />
    </Container>
  );
};
export default TokenAndAmount;
