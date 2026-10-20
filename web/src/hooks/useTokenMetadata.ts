import { useState, useEffect } from "react";
import { Alchemy, TokenMetadataResponse } from "alchemy-sdk";

import { DEFAULT_CHAIN } from "consts/chains";
import { alchemyConfig } from "utils/alchemyConfig";
import { fetchOnchainTokenMetadata } from "utils/fetchOnchainTokenMetadata";

type TokenMetadataWithOptionalDecimals = Omit<TokenMetadataResponse, "decimals"> & {
  decimals?: number;
};

type TokenAddress = string | null | undefined;

type TokenMetadataResult = {
  address: string;
  metadata: TokenMetadataWithOptionalDecimals | null;
};

export const useTokenMetadata = (tokenAddress: TokenAddress) => {
  const [result, setResult] = useState<TokenMetadataResult | undefined>(undefined);

  useEffect(() => {
    if (!tokenAddress) return;
    //Set on cleanup so a lookup that resolves after the address changed is ignored.
    let isStale = false;

    const fetchTokenMetadata = async () => {
      const alchemy = new Alchemy(alchemyConfig(DEFAULT_CHAIN));
      try {
        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);

        //Means alchemy metadata is missing or incomplete, so we throw to try the contract directly.
        if (!metadata.name || !metadata.symbol) {
          throw new Error("No token metadata returned by alchemy");
        }

        if (isStale) return;
        setResult({
          address: tokenAddress,
          metadata: {
            ...metadata,
            decimals: metadata.decimals ?? undefined, //Set undefined if null to facilitate checks in the UI
          },
        });
      } catch (error) {
        const onchainMetadata = await fetchOnchainTokenMetadata(tokenAddress as `0x${string}`, DEFAULT_CHAIN).catch(
          () => null
        );

        if (isStale) return;
        if (onchainMetadata) {
          setResult({ address: tokenAddress, metadata: { ...onchainMetadata, logo: null } });
        } else {
          console.error("Error fetching token metadata:", error);
          setResult({ address: tokenAddress, metadata: null });
        }
      }
    };

    fetchTokenMetadata();

    return () => {
      isStale = true;
    };
  }, [tokenAddress]);

  //Only return metadata that belongs to the current address, so a previous lookup never leaks into a new one.
  const tokenMetadata = tokenAddress && result?.address === tokenAddress ? result.metadata : undefined;

  return { tokenMetadata };
};
