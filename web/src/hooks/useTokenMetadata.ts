import { useState, useEffect } from "react";
import { Alchemy } from "alchemy-sdk";
import { useAccount } from "wagmi";
import { alchemyConfig } from "utils/alchemyConfig";

export const useTokenMetadata = (tokenAddress: string) => {
  const { chain } = useAccount();
  const [tokenMetadata, setTokenMetadata] = useState<any>(null);

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!tokenAddress || tokenAddress === "native" || !chain) return;
      const alchemy = new Alchemy(alchemyConfig(chain.id));
      try {
        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
        setTokenMetadata(metadata);
      } catch (error) {
        console.error("Error fetching token metadata:", error);
        setTokenMetadata(null);
      }
    };

    fetchTokenMetadata();
  }, [tokenAddress, chain]);

  return { tokenMetadata };
};
