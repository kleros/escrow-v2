import { useState, useEffect } from "react";
import { Alchemy } from "alchemy-sdk";
import { useChainId } from "wagmi";
import { alchemyConfig } from "utils/alchemyConfig";

export const useTokenMetadata = (tokenAddress: string) => {
  const chainId = useChainId();
  const [tokenMetadata, setTokenMetadata] = useState<any>(null);

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!tokenAddress || tokenAddress === "native") return;
      const alchemy = new Alchemy(alchemyConfig(chainId));
      try {
        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
        setTokenMetadata(metadata);
      } catch (error) {
        console.error("Error fetching token metadata:", error);
        setTokenMetadata(null);
      }
    };

    fetchTokenMetadata();
  }, [tokenAddress, chainId]);

  return { tokenMetadata };
};