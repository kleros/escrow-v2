import { useContractRead } from "wagmi";

const KLEROS_CORE_ADDRESS = "0xA54e7A16d7460e38a8F324eF46782FB520d58CE8";
const KLEROS_CORE_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "arbitrationCost",
    outputs: [
      {
        name: "cost",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const useArbitrationCost = (arbitratorExtraData) => {
  const { data, isError, isLoading } = useContractRead({
    address: KLEROS_CORE_ADDRESS,
    abi: KLEROS_CORE_ABI,
    functionName: "arbitrationCost",
    args: [arbitratorExtraData],
  });

  return {
    arbitrationCost: data ? data : null,
    isLoading,
    isError,
  };
};
