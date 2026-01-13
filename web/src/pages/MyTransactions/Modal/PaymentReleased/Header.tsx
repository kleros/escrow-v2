import React from "react";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const Header: React.FC = () => {
  const { amount, assetSymbol } = useTransactionDetailsContext();

  return (
    <h1 className="m-0 mb-6 text-center">
      Full payment released: {formatEther(amount)} {assetSymbol}
    </h1>
  );
};
export default Header;
