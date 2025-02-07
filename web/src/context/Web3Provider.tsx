import React from "react";

import { fallback, http, WagmiProvider, webSocket } from "wagmi";
import { mainnet, arbitrumSepolia, gnosisChiado, type AppKitNetwork } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { lightTheme } from "styles/themes";

export const alchemyApiKey = import.meta.env.ALCHEMY_API_KEY ?? "";

const alchemyToViemChain = {
  [arbitrumSepolia.id]: "arb-sepolia",
  [mainnet.id]: "eth-mainnet",
};

type AlchemyProtocol = "https" | "wss";

const alchemyURL = (protocol: AlchemyProtocol, chainId: number | string) =>
  `${protocol}://${alchemyToViemChain[chainId]}.g.alchemy.com/v2/${alchemyApiKey}`;

const getTransports = () => {
  const alchemyTransport = (chain: AppKitNetwork) =>
    fallback([http(alchemyURL("https", chain.id)), webSocket(alchemyURL("wss", chain.id))]);
  const chiadoTransport = () =>
    fallback([http("https://rpc.chiadochain.net"), webSocket("wss://rpc.chiadochain.net/wss")]);

  return {
    [arbitrumSepolia.id]: alchemyTransport(arbitrumSepolia),
    [mainnet.id]: alchemyTransport(mainnet),
    [gnosisChiado.id]: chiadoTransport(),
  };
};

const chains = [arbitrumSepolia, mainnet, gnosisChiado] as [AppKitNetwork, ...AppKitNetwork[]];
const transports = getTransports();
const projectId = import.meta.env.WALLETCONNECT_PROJECT_ID ?? "";

const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  transports,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  defaultNetwork: arbitrumSepolia,
  projectId,
  themeVariables: {
    "--w3m-color-mix": lightTheme.primaryPurple,
    "--w3m-color-mix-strength": 20,
    // overlay portal is at 9999
    "--w3m-z-index": 10000,
  },
});
const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <WagmiProvider config={wagmiAdapter.wagmiConfig}> {children} </WagmiProvider>;
};

export default Web3Provider;
