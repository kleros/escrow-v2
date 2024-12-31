import { DEFAULT_CHAIN, getChain } from "consts/chains";

export const useNativeTokenSymbol = () => {
  return getChain(DEFAULT_CHAIN)?.nativeCurrency.symbol;
};
