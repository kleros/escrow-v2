import { formatETH, formatPNK, formatTokenAmount } from "./format";

export const getFormattedBalance = (balanceData: bigint, token: any) => {
  if (balanceData === undefined) return undefined;
  if (token?.address === "native") return formatETH(balanceData);
  if (token?.symbol === "PNK") return formatPNK(balanceData);
  return formatTokenAmount(balanceData, token?.decimals);
};
