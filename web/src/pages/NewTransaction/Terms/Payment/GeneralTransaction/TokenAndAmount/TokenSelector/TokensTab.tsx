import React from "react";
import { Field } from "@kleros/ui-components-library";
import { Item, TokenLabel, TokenLogo } from "../TokenSelector";

interface ITokensTab {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredTokens: { label: string; value: string; logo: string }[];
  handleSelectToken: (value: string) => void;
}

const TokensTab: React.FC<ITokensTab> = ({ searchQuery, setSearchQuery, filteredTokens, handleSelectToken }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <Field placeholder="Search..." value={searchQuery} onChange={handleSearch} />
      {filteredTokens.map((token) => (
        <Item key={token.value} onClick={() => handleSelectToken(token.value)}>
          <TokenLogo src={token.logo} alt={`${token.label} logo`} />
          <TokenLabel>{token.label}</TokenLabel>
        </Item>
      ))}
    </div>
  );
};

export default TokensTab;
