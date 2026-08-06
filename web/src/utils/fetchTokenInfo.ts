import { Alchemy } from "alchemy-sdk";
import { IToken } from "context/NewTransactionContext";
import { fetchOnchainTokenMetadata } from "./fetchOnchainTokenMetadata";

export const fetchTokenInfo = async (address: string, alchemyInstance: Alchemy, chainId: number) => {
  try {
    const metadata = await alchemyInstance.core.getTokenMetadata(address);

    //Means alchemy knows nothing about the token, so we throw to try the contract directly.
    if (!metadata.name && !metadata.symbol) {
      throw new Error("No token metadata returned by alchemy");
    }

    return {
      symbol: metadata.symbol?.toUpperCase(),
      logo: metadata.logo,
      address,
      decimals: metadata.decimals ?? undefined, //Set undefined if null to facilitate checks in the UI
    } as IToken;
  } catch (error) {
    const onchainMetadata = await fetchOnchainTokenMetadata(address as `0x${string}`, chainId).catch(() => null);

    if (!onchainMetadata) {
      return console.error("Error fetching token info:", error);
    }

    return {
      symbol: onchainMetadata.symbol.toUpperCase(),
      address,
      decimals: onchainMetadata.decimals,
    } as IToken;
  }
};
