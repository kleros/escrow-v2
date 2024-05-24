import { Alchemy } from "alchemy-sdk";
import EthTokenIcon from "svgs/icons/eth-token-icon.png";

export const fetchTokenInfo = async (address: string, alchemyInstance: Alchemy) => {
  try {
    const metadata = await alchemyInstance.core.getTokenMetadata(address);
    return {
      symbol: metadata.symbol?.toUpperCase() || "Unknown",
      logo: metadata.logo || EthTokenIcon,
    };
  } catch (error) {
    console.error("Error fetching token info:", error);
    return { symbol: "Unknown", logo: EthTokenIcon };
  }
};
