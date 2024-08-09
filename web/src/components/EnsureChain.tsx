import React from "react";
import { DEFAULT_CHAIN } from "consts/chains";
import { useAccount } from "wagmi";
import ConnectWallet from "components/ConnectWallet";

interface IEnsureChain {
  children: React.ReactElement;
}

export const EnsureChain: React.FC<IEnsureChain> = ({ children }) => {
  const { chainId } = useAccount();

  return chainId === DEFAULT_CHAIN ? children : <ConnectWallet />;
};
