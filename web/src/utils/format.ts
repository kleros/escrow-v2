import { formatEther, formatUnits } from "viem";
import { commify } from "./commify";

export const roundNumberDown = (value: number, fractionDigits = 0) => {
  const factor = 10 ** fractionDigits;
  return Math.floor(value * factor) / factor;
};

export const formatUnitsWei = (value: bigint, decimals = 18) => formatUnits(value, decimals);

export const formatValue = (value: string, fractionDigits: number, roundDown: boolean) => {
  let units = Number(value);
  if (roundDown) units = roundNumberDown(units, fractionDigits);
  return commify(units.toFixed(fractionDigits));
};

export const formatPNK = (value: bigint, fractionDigits = 0, roundDown = true) => {
  return formatValue(formatUnitsWei(value), fractionDigits, roundDown);
};

export const formatETH = (value: bigint, fractionDigits = 4, roundDown = true) => {
  return formatValue(formatEther(value), fractionDigits, roundDown);
};

export const formatTokenAmount = (value: bigint, decimals = 18, fractionDigits = 4, roundDown = true) => {
  return formatValue(formatUnits(value, decimals), fractionDigits, roundDown);
};

export const formatUSD = (value: number, fractionDigits = 2) => "$" + commify(Number(value).toFixed(fractionDigits));
