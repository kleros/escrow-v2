import React from "react";
import styled from "styled-components";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";

const StyledHeader = styled.h1`
  margin: 0;
  margin-bottom: 24px;
  text-align: center;
`;

const Header: React.FC = () => {
  const { amount, asset } = useTransactionDetailsContext();
  const nativeTokenSymbol = useNativeTokenSymbol();

  return (
    <StyledHeader>
      Full payment released: {formatEther(amount)} {asset === "native" ? nativeTokenSymbol : asset}
    </StyledHeader>
  );
};
export default Header;
