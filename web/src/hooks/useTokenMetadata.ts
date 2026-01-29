import { useState, useEffect } from "react";
import { Alchemy, TokenMetadataResponse } from "alchemy-sdk";

import { DEFAULT_CHAIN } from "consts/chains";
import { alchemyConfig } from "utils/alchemyConfig";

type TokenMetadataWithOptionalDecimals = Omit<TokenMetadataResponse, "decimals"> & {
  decimals?: number;
};

export const useTokenMetadata = (tokenAddress: string) => {
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataWithOptionalDecimals | null>(null);

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!tokenAddress || tokenAddress === "native") return;
      const alchemy = new Alchemy(alchemyConfig(DEFAULT_CHAIN));
      try {
        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
        setTokenMetadata({
          ...metadata,
          decimals: metadata.decimals ?? undefined, //Set undefined if null to facilitate checks in the UI
        });
      } catch (error) {
        console.error("Error fetching token metadata:", error);
        setTokenMetadata(null);
      }
    };

    fetchTokenMetadata();
  }, [tokenAddress]);

  return { tokenMetadata };
};
