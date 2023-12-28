import { useNetwork } from "wagmi";

export const useNativeTokenSymbol = () => {
  const { chain } = useNetwork();
  return chain?.nativeCurrency?.symbol;
};
