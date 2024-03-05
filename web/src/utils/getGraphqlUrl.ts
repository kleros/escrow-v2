import { arbitrumSepolia } from "wagmi/chains";

const REACT_APP_ARBSEPOLIA_SUBGRAPH = {
  [arbitrumSepolia.id]:
    process.env.REACT_APP_ARBSEPOLIA_SUBGRAPH ?? "Wrong Subgraph URL. Please check the environment variables.",
};

export const getGraphqlUrl = (chainId: number = arbitrumSepolia.id) => {
  return REACT_APP_ARBSEPOLIA_SUBGRAPH[chainId];
};
