import React from "react";
import styled from "styled-components";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const StyledHeader = styled.h1`
  margin: 0;
  margin-bottom: 24px;
  text-align: center;
`;

const Header: React.FC = () => {
  const { amount, assetSymbol } = useTransactionDetailsContext();

  return (
    <StyledHeader>
      Full payment released: {formatEther(amount)} {assetSymbol}
    </StyledHeader>
  );
};
export default Header;
