import { useState, useEffect } from "react";
import { Alchemy } from "alchemy-sdk";
import { useNetwork } from "wagmi";
import alchemyConfig from "utils/alchemyConfig";

export const useERC20TokenSymbol = (tokenAddress: string) => {
  const { chain } = useNetwork();
  const [erc20TokenSymbol, setErc20TokenSymbol] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenSymbol = async () => {
      if (!tokenAddress || tokenAddress === "native") return;
      const alchemy = new Alchemy(alchemyConfig(chain?.id));
      try {
        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
        setErc20TokenSymbol(metadata.symbol || null);
      } catch (error) {
        console.error("Error fetching token symbol:", error);
        setErc20TokenSymbol(null);
      }
    };

    fetchTokenSymbol();
  }, [tokenAddress, chain?.id]);

  return { erc20TokenSymbol };
};
