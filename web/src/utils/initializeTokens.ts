import { Alchemy } from "alchemy-sdk";
import { fetchNativeToken } from "./fetchNativeToken";
import { fetchTokenInfo } from "./fetchTokenInfo";

export const initializeTokens = async (address: string, setTokens, setLoading, chain, alchemyInstance: Alchemy) => {
  try {
    setLoading(true);
    const nativeToken = fetchNativeToken(chain);
    const balances = await alchemyInstance.core.getTokenBalances(address);
    const tokenList = balances.tokenBalances.map(async (token) => {
      const tokenInfo = await fetchTokenInfo(token.contractAddress, alchemyInstance);
      return {
        label: tokenInfo.symbol,
        value: token.contractAddress,
        logo: tokenInfo.logo,
      };
    });
    const allTokens = [nativeToken, ...(await Promise.all(tokenList))];
    const customTokens = JSON.parse(localStorage.getItem("tokens")) || [];
    const combinedTokens = [
      ...allTokens,
      ...customTokens.filter((ct) => !allTokens.some((token) => token.value === ct.value)),
    ];
    setTokens(combinedTokens);
    localStorage.setItem("tokens", JSON.stringify(combinedTokens));
    setLoading(false);
  } catch (error) {
    console.error("Error initializing tokens:", error);
    setLoading(false);
  }
};
