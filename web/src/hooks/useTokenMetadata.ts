import { useState, useEffect } from "react";
import { Alchemy, TokenMetadataResponse } from "alchemy-sdk";

import { DEFAULT_CHAIN } from "consts/chains";
import { alchemyConfig } from "utils/alchemyConfig";

export const useTokenMetadata = (tokenAddress: string) => {
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataResponse | null>(null);

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!tokenAddress || tokenAddress === "native") return;
      const alchemy = new Alchemy(alchemyConfig(DEFAULT_CHAIN));
      try {
        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
        setTokenMetadata(metadata);
      } catch (error) {
        console.error("Error fetching token metadata:", error);
        setTokenMetadata(null);
      }
    };

    fetchTokenMetadata();
  }, [tokenAddress]);

  return { tokenMetadata };
};
