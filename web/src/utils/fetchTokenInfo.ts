import { Alchemy } from "alchemy-sdk";
import { IToken } from "context/NewTransactionContext";

export const fetchTokenInfo = async (address: string, alchemyInstance: Alchemy) => {
  try {
    const metadata = await alchemyInstance.core.getTokenMetadata(address);
    return {
      symbol: metadata.symbol?.toUpperCase(),
      logo: metadata.logo,
      address,
      decimals: metadata.decimals ?? undefined, //Set undefined if null to facilitate checks in the UI
    } as IToken;
  } catch (error) {
    return console.error("Error fetching token info:", error);
  }
};
