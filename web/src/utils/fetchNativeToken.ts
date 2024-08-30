const CHAIN_NATIVE_TOKENS = {
  42161: 'ETH',
  421614: 'ETH',
};

export const fetchNativeToken = (chainId: number) => {
  const symbol = CHAIN_NATIVE_TOKENS[chainId] || 'Unknown';
  return {
    symbol: symbol,
    address: 'native',
  };
};
