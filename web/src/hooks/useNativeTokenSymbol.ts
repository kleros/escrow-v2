import { useChainId } from "wagmi";

export const useNativeTokenSymbol = () => {
  const chainId = useChainId();
  return chain?.nativeCurrency?.symbol;
};
