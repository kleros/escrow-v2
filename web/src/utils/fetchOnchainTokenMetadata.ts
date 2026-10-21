import { erc20Abi } from "viem";
import { multicall } from "wagmi/actions";
import { wagmiConfig } from "context/Web3Provider";

type SupportedChainId = (typeof wagmiConfig)["chains"][number]["id"];

//Fallback for when alchemy sdk fails or knows nothing about the token.
export const fetchOnchainTokenMetadata = async (tokenAddress: `0x${string}`, chainId: number) => {
  const contract = { abi: erc20Abi, address: tokenAddress } as const;
  const [name, symbol, decimals] = await multicall(wagmiConfig, {
    chainId: chainId as SupportedChainId,
    contracts: [
      { ...contract, functionName: "name" },
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
    ],
  });

  if (name.status === "failure" && symbol.status === "failure" && decimals.status === "failure") {
    return null;
  }

  return {
    name: name.result ?? "Unknown",
    symbol: symbol.result ?? "Unknown",
    decimals: decimals.result, //undefined if the call failed, to facilitate checks in the UI
  };
};
