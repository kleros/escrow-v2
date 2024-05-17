import { fetchNativeToken } from "./fetchNativeToken";
import { fetchTokenInfo } from "./fetchTokenInfo";

export const fetchOwnedTokensFromAlchemy = async (alchemy, address: string, setOwnedTokens, setLoading, chain) => {
  try {
    setLoading(true);
    const nativeToken = fetchNativeToken(chain);
    const balances = await alchemy.core.getTokenBalances(address);
    const tokenList = balances.tokenBalances.map(async (token) => {
      const tokenInfo = await fetchTokenInfo(alchemy, token.contractAddress);
      return {
        label: tokenInfo.symbol,
        value: token.contractAddress,
        logo: tokenInfo.logo,
      };
    });
    const allTokens = [nativeToken, ...(await Promise.all(tokenList))];
    setOwnedTokens(allTokens);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching owned tokens:", error);
    setLoading(false);
  }
};
