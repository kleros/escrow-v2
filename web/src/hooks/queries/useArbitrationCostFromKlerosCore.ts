import { useReadContract } from "wagmi";
import { parseAbi } from "viem";

const KLEROS_CORE_ADDRESS = "0xA54e7A16d7460e38a8F324eF46782FB520d58CE8";
const KLEROS_CORE_ABI = parseAbi([
  "function arbitrationCost(bytes _extraData) view returns (uint256 cost)",
]);

export const useArbitrationCost = (arbitratorExtraData: string) => {
  const { data, isError, isLoading } = useReadContract({
    address: KLEROS_CORE_ADDRESS,
    abi: KLEROS_CORE_ABI,
    functionName: "arbitrationCost",
    args: [arbitratorExtraData],
  });

  return {
    arbitrationCost: data !== undefined ? data : null,
    isLoading,
    isError,
  };
};