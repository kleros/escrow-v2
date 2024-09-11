import { useAccount } from "wagmi";

export const useNativeTokenSymbol = () => {
  const { chain } = useAccount();
  return chain?.nativeCurrency.symbol;
};
