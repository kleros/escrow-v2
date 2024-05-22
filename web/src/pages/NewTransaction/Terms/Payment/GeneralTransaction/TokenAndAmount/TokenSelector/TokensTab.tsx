import React from "react";
import { Field } from "@kleros/ui-components-library";
import { Item, TokenLabel, TokenLogo } from "../TokenSelector";

interface ITokensTab {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredTokens: { symbol: string; address: string; logo: string }[];
  handleSelectToken: (token: { symbol: string; address: string; logo: string }) => void;
}

const TokensTab: React.FC<ITokensTab> = ({ searchQuery, setSearchQuery, filteredTokens, handleSelectToken }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <Field placeholder="Search..." value={searchQuery} onChange={handleSearch} />
      {filteredTokens.map((token) => (
        <Item key={token.address} onClick={() => handleSelectToken(token)}>
          <TokenLogo src={token.logo} alt={`${token?.symbol} logo`} />
          <TokenLabel>{token.symbol}</TokenLabel>
        </Item>
      ))}
    </div>
  );
};

export default TokensTab;
