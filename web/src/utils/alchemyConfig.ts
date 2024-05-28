import { alchemyApiKey } from "context/Web3Provider";
import { mapWagmiNetworkToAlchemyNetwork } from "utils/mapWagmiNetworkToAlchemyNetwork";

export const alchemyConfig = (chainId: number) => ({
  apiKey: alchemyApiKey,
  network: mapWagmiNetworkToAlchemyNetwork(chainId),
});
