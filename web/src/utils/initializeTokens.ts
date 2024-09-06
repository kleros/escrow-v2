import { Alchemy } from "alchemy-sdk";
import { IToken } from "context/NewTransactionContext";
import { fetchNativeToken } from "./fetchNativeToken";
import { fetchTokenInfo } from "./fetchTokenInfo";

export const initializeTokens = async (address: string, setTokens, setLoading, chainId: number, alchemyInstance: Alchemy) => {
  try {
    setLoading(true);
    const nativeToken = fetchNativeToken(chainId);
    const balances = await alchemyInstance.core.getTokenBalances(address);
    const tokenList = await Promise.all(
      balances.tokenBalances.map(async (token) => {
        const tokenInfo = await fetchTokenInfo(token.contractAddress, alchemyInstance);
        if (tokenInfo) {
          return {
            symbol: tokenInfo.symbol,
            address: tokenInfo.address,
            logo: tokenInfo.logo,
          } as IToken;
        }
        return null;
      })
    );
    const allTokens = [nativeToken, ...tokenList];
    const customTokensString = localStorage.getItem("tokens");
    const customTokens = customTokensString ? JSON.parse(customTokensString) : [];
    const combinedTokens = [
      ...allTokens,
      ...customTokens.filter((customToken) => !allTokens.some((token) => token.address === customToken.address)),
    ];
    setTokens(combinedTokens);
    localStorage.setItem("tokens", JSON.stringify(combinedTokens));
    setLoading(false);
  } catch (error) {
    console.error("Error initializing tokens:", error);
    setLoading(false);
  }
};
