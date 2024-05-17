import { Network } from "alchemy-sdk";

export function mapWagmiNetworkToAlchemyNetwork(chainId: number) {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET;
    case 11155111:
      return Network.ETH_SEPOLIA;
    case 10:
      return Network.OPT_MAINNET;
    case 137:
      return Network.MATIC_MAINNET;
    case 42161:
      return Network.ARB_MAINNET;
    case 421614:
      return Network.ARB_SEPOLIA;
    default:
      return Network.ARB_SEPOLIA;
  }
}
