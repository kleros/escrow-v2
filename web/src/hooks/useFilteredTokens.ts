import { useEffect, useState } from "react";
import { useTokenMetadata } from "./useTokenMetadata";
import { IToken } from "context/NewTransactionContext";

export const useFilteredTokens = (
  searchQuery: string,
  tokens: IToken[],
  setTokens: (tokens: IToken) => void,
  sendingToken: IToken
) => {
  const { tokenMetadata } = useTokenMetadata(
    searchQuery.startsWith("0x") && searchQuery.length === 42 ? searchQuery : null
  );
  const [filteredTokens, setFilteredTokens] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      let filtered = [];

      if (!searchQuery) {
        filtered = tokens;
        if (sendingToken) {
          filtered = [sendingToken, ...tokens.filter((token) => token.address !== sendingToken.address)];
        }
      } else if (tokenMetadata) {
        const existingToken = tokens.find((t) => t.address.toLowerCase() === searchQuery.toLowerCase());

        if (existingToken) {
          filtered = [existingToken];
        } else {
          const resultToken = {
            symbol: tokenMetadata.symbol,
            address: searchQuery.toLowerCase(),
            logo: tokenMetadata.logo,
          };

          const updatedTokens = [...tokens, resultToken];
          const uniqueTokens = Array.from(new Set(updatedTokens.map((a) => a.address))).map((address) => {
            return updatedTokens.find((a) => a.address === address);
          });

          filtered = [resultToken];
          setTokens(uniqueTokens);
          localStorage.setItem("tokens", JSON.stringify(uniqueTokens));
        }
      } else {
        filtered = tokens.filter((token) => token.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setFilteredTokens(filtered);
    };

    handleSearch();
  }, [searchQuery, tokens, setTokens, sendingToken, tokenMetadata]);

  return { filteredTokens };
};
