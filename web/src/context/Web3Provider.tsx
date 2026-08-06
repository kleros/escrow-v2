import React from "react";

import { fallback, http, WagmiProvider, webSocket } from "wagmi";
import { mainnet, arbitrumSepolia, type AppKitNetwork, arbitrum } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { isProductionDeployment } from "consts/index";
import { ALL_CHAINS, DEFAULT_CHAIN } from "consts/chains";

export const alchemyApiKey = import.meta.env.ALCHEMY_API_KEY ?? "";
if (!alchemyApiKey) {
  throw new Error("Alchemy API key is not set in ALCHEMY_API_KEY environment variable.");
}

export const infuraApiKey = import.meta.env.INFURA_API_KEY ?? "";

const isProduction = isProductionDeployment();

// https://github.com/alchemyplatform/alchemy-sdk-js/blob/c4440cb/src/types/types.ts#L98-L153
const alchemyToViemChain: Record<number, string> = {
  [arbitrumSepolia.id]: "arb-sepolia",
  [arbitrum.id]: "arb-mainnet",
  [mainnet.id]: "eth-mainnet",
};

type AlchemyProtocol = "https" | "wss";

// https://github.com/alchemyplatform/alchemy-sdk-js/blob/c4440cb/src/util/const.ts#L16-L18
function alchemyURL(protocol: AlchemyProtocol, chainId: number | string): string {
  const network = alchemyToViemChain[chainId];
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return `${protocol}://${network}.g.alchemy.com/v2/${alchemyApiKey}`;
}

function infuraURL(chainId: number | string): string | undefined {
  const network = infuraToViemChain[chainId];
  if (!infuraApiKey || !network) {
    return undefined;
  }
  return `https://${network}.infura.io/v3/${infuraApiKey}`;
}

// https://docs.infura.io/get-started/endpoints/
const infuraToViemChain: Record<number, string> = {
  [arbitrumSepolia.id]: "arbitrum-sepolia",
  [arbitrum.id]: "arbitrum-mainnet",
  [mainnet.id]: "mainnet",
};

export const getChainRpcUrl = (protocol: AlchemyProtocol, chainId: number | string) => {
  return alchemyURL(protocol, chainId);
};

export const getDefaultChainRpcUrl = (protocol: AlchemyProtocol) => {
  return getChainRpcUrl(protocol, DEFAULT_CHAIN);
};

const buildTransport = (chain: AppKitNetwork) => {
  const fallbackURL = infuraURL(chain.id);
  return fallback([
    http(alchemyURL("https", chain.id)),
    ...(fallbackURL ? [http(fallbackURL)] : []),
    webSocket(alchemyURL("wss", chain.id)),
  ]);
};

const transports = {
  [isProduction ? arbitrum.id : arbitrumSepolia.id]: buildTransport(isProduction ? arbitrum : arbitrumSepolia),
  [mainnet.id]: buildTransport(mainnet), // Always enabled for ENS resolution
};

const chains = ALL_CHAINS as [AppKitNetwork, ...AppKitNetwork[]];

const projectId = import.meta.env.WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error("WalletConnect project ID is not set in WALLETCONNECT_PROJECT_ID environment variable.");
}

const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  transports,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  defaultNetwork: isProduction ? arbitrum : arbitrumSepolia,
  projectId,
  allowUnsupportedChain: true,
  themeVariables: {
    "--w3m-color-mix": "#4D00B4",
    "--w3m-color-mix-strength": 20,
    // overlay portal is at 9999
    "--w3m-z-index": 10000,
  },
});
const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <WagmiProvider config={wagmiAdapter.wagmiConfig}> {children} </WagmiProvider>;
};

export default Web3Provider;
