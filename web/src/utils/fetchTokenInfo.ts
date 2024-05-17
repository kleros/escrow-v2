export const fetchTokenInfo = async (alchemy, address: string) => {
  try {
    const metadata = await alchemy.core.getTokenMetadata(address);
    return {
      symbol: metadata.symbol?.toUpperCase() || "Unknown",
      logo: metadata.logo || "https://via.placeholder.com/24",
    };
  } catch (error) {
    console.error("Error fetching token info:", error);
    return { symbol: "Unknown", logo: "https://via.placeholder.com/24" };
  }
};
