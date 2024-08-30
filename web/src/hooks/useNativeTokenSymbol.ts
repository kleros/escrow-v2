import { useChainId } from "wagmi";
import { getChain } from "consts/chains";

export const useNativeTokenSymbol = () => {
  const chainId = useChainId();
  const chain = getChain(chainId);
  return chain?.nativeCurrency.symbol;
};