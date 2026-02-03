import React from "react";
import { formatETH, formatTokenAmount } from "utils/format";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useTokenMetadata } from "hooks/useTokenMetadata";

const Header: React.FC = () => {
  const { amount, assetSymbol, token } = useTransactionDetailsContext();
  const { tokenMetadata } = useTokenMetadata(token);
  const formattedAmount = token ? formatTokenAmount(amount, tokenMetadata?.decimals) : formatETH(amount);

  return (
    <h1 className="m-0 mb-6 text-center">
      Full payment released: {formattedAmount} {assetSymbol}
    </h1>
  );
};
export default Header;
