export const fetchNativeToken = (chain) => {
  return {
    symbol: chain?.nativeCurrency?.symbol || "Native Token",
    address: "native",
    logo: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
  };
};
