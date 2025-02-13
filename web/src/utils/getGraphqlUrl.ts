import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { DEFAULT_CHAIN } from "consts/chains";

export const getGraphqlUrl = (chainId: number = DEFAULT_CHAIN) => {
  const subgraphs = {
    [arbitrumSepolia.id]:
      import.meta.env.REACT_APP_ARBSEPOLIA_SUBGRAPH ?? "Wrong Subgraph URL. Please check the environment variables.",
    [arbitrum.id]:
      import.meta.env.REACT_APP_ARBMAINNET_SUBGRAPH ?? "Wrong Subgraph URL. Please check the environment variables.",
  };
  return subgraphs[chainId];
};
