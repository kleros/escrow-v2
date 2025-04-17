import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { KLEROS_CORE_ADDRESS } from "consts/arbitration";

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