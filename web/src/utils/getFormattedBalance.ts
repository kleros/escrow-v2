import { formatETH, formatPNK } from "./format";

export const getFormattedBalance = (balanceData: any, token: any) => {
  if (!balanceData) return undefined;
  if (token?.symbol === "PNK") return formatPNK(balanceData.value);
  return formatETH(balanceData.value);
};
