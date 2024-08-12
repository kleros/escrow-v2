import React from "react";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { type Chain } from "viem";
import { createConfig, fallback, http, WagmiProvider, webSocket } from "wagmi";
import { mainnet, arbitrumSepolia, gnosisChiado } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

import { lightTheme } from "styles/themes";

export const alchemyApiKey = import.meta.env.ALCHEMY_API_KEY ?? "";

const alchemyToViemChain = {
  [arbitrumSepolia.id]: "arb-sepolia",
  [mainnet.id]: "eth-mainnet",
};

type AlchemyProtocol = "https" | "wss";

const alchemyURL = (protocol: AlchemyProtocol, chainId: number) =>
  `${protocol}://${alchemyToViemChain[chainId]}.g.alchemy.com/v2/${alchemyApiKey}`;

const getTransports = () => {
  const alchemyTransport = (chain: Chain) =>
    fallback([http(alchemyURL("https", chain.id)), webSocket(alchemyURL("wss", chain.id))]);
  const chiadoTransport = () =>
    fallback([
      http("https://rpc.chiadochain.net"),
      webSocket("wss://rpc.chiadochain.net/wss"),
    ]);

  return {
    [arbitrumSepolia.id]: alchemyTransport(arbitrumSepolia),
    [mainnet.id]: alchemyTransport(mainnet),
    [gnosisChiado.id]: chiadoTransport(),
  };
};

const chains = [arbitrumSepolia, mainnet, gnosisChiado] as [Chain, ...Chain[]];
const transports = getTransports();
const projectId = import.meta.env.WALLETCONNECT_PROJECT_ID ?? "";
const wagmiConfig = createConfig({
  chains,
  transports,
  connectors: [walletConnect({ projectId })],
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeVariables: {
    "--w3m-color-mix": lightTheme.primaryPurple,
    "--w3m-color-mix-strength": 20,
  },
});

const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}> {children} </WagmiProvider>;
};

export default Web3Provider;
