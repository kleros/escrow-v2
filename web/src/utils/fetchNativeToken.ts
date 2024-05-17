export const fetchNativeToken = (chain) => {
  return {
    label: chain?.nativeCurrency?.symbol || "Native Token",
    value: "native",
    logo: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
  };
};
