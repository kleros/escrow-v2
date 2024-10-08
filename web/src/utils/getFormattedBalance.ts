import { formatETH, formatPNK } from "./format";

export const getFormattedBalance = (balanceData: bigint, token: any) => {
  if (balanceData === undefined) return undefined;
  if (token?.symbol === "PNK") return formatPNK(balanceData);
  return formatETH(balanceData);
};
