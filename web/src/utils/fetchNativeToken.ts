export const fetchNativeToken = (chain) => {
  return {
    symbol: chain?.nativeCurrency?.symbol,
    address: "native",
  };
};
