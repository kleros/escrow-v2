import { useState, useEffect } from "react";
import { Alchemy, TokenMetadataResponse } from "alchemy-sdk";

import { DEFAULT_CHAIN } from "consts/chains";
import { alchemyConfig } from "utils/alchemyConfig";
import { fetchOnchainTokenMetadata } from "utils/fetchOnchainTokenMetadata";

type TokenMetadataWithOptionalDecimals = Omit<TokenMetadataResponse, "decimals"> & {
  decimals?: number;
};

type TokenAddress = string | null | undefined;

export const useTokenMetadata = (tokenAddress: TokenAddress) => {
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataWithOptionalDecimals | null | undefined>(undefined);

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!tokenAddress) return;
      const alchemy = new Alchemy(alchemyConfig(DEFAULT_CHAIN));
      try {
        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);

        //Means alchemy metadata is missing or incomplete, so we throw to try the contract directly.
        if (!metadata.name || !metadata.symbol) {
          throw new Error("No token metadata returned by alchemy");
        }

        setTokenMetadata({
          ...metadata,
          decimals: metadata.decimals ?? undefined, //Set undefined if null to facilitate checks in the UI
        });
      } catch (error) {
        const onchainMetadata = await fetchOnchainTokenMetadata(tokenAddress as `0x${string}`, DEFAULT_CHAIN).catch(
          () => null
        );

        if (onchainMetadata) {
          setTokenMetadata({ ...onchainMetadata, logo: null });
        } else {
          console.error("Error fetching token metadata:", error);
          setTokenMetadata(null);
        }
      }
    };

    fetchTokenMetadata();
  }, [tokenAddress]);

  return { tokenMetadata };
};
