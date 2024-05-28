import EthTokenIcon from "svgs/icons/eth-token-icon.png";

export const fetchNativeToken = (chain) => {
  return {
    symbol: chain?.nativeCurrency?.symbol,
    address: "native",
    logo: EthTokenIcon,
  };
};
