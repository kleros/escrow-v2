import { Alchemy } from "alchemy-sdk";

export const fetchTokenInfo = async (address: string, alchemyInstance: Alchemy) => {
  try {
    const metadata = await alchemyInstance.core.getTokenMetadata(address);
    return {
      symbol: metadata.symbol?.toUpperCase() || "Unknown",
      logo: metadata.logo || "https://via.placeholder.com/24",
    };
  } catch (error) {
    console.error("Error fetching token info:", error);
    return { symbol: "Unknown", logo: "https://via.placeholder.com/24" };
  }
};
