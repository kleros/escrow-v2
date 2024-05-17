import { alchemyApiKey } from "context/Web3Provider";
import { mapWagmiNetworkToAlchemyNetwork } from "utils/mapWagmiNetworkToAlchemyNetwork";

const alchemyConfig = (chainId: number) => ({
  apiKey: alchemyApiKey,
  network: mapWagmiNetworkToAlchemyNetwork(chainId),
});

export default alchemyConfig;
