import { useEffect, useState } from "react";
import { useTokenMetadata } from "./useTokenMetadata";
import EthTokenIcon from "svgs/icons/eth-token-icon.png";

export const useFilteredTokens = (searchQuery: string, tokens, setTokens, sendingToken) => {
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
        const resultToken = {
          symbol: tokenMetadata.symbol,
          address: searchQuery.toLowerCase(),
          logo: tokenMetadata.logo || EthTokenIcon,
        };

        const updatedTokens = [...tokens, resultToken];
        const uniqueTokens = Array.from(new Set(updatedTokens.map((a) => a.address))).map((address) => {
          return updatedTokens.find((a) => a.address === address);
        });

        filtered = [resultToken];
        setTokens(uniqueTokens);
        localStorage.setItem("tokens", JSON.stringify(uniqueTokens));
      } else {
        filtered = tokens.filter((token) => token.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setFilteredTokens(filtered);
    };

    handleSearch();
  }, [searchQuery, tokens, setTokens, sendingToken, tokenMetadata]);

  return { filteredTokens };
};
