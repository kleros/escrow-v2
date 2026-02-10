import { formatEther, formatUnits } from "viem";
import { commify } from "./commify";

export const roundNumberDown = (value: number, fractionDigits = 0) => {
  const factor = 10 ** fractionDigits;
  return Math.floor(value * factor) / factor;
};

export const formatUnitsWei = (value: bigint, decimals = 18) => formatUnits(value, decimals);

export const formatValue = (value: string, fractionDigits: number, roundDown: boolean) => {
  const rawUnits = Number(value);
  let units = rawUnits;
  if (roundDown) units = roundNumberDown(units, fractionDigits);
  const formattedValue = commify(units.toFixed(fractionDigits));

  // Amount is positive but rounds to zero → show "< 0.0001" (or equivalent considering fractionDigits) instead of "0"
  if (rawUnits > 0 && units === 0) {
    const threshold = (10 ** -fractionDigits).toFixed(fractionDigits);
    return "< " + commify(threshold);
  }
  return formattedValue;
};

export const formatETH = (value: bigint, fractionDigits = 4, roundDown = true) => {
  return formatValue(formatEther(value), fractionDigits, roundDown);
};

export const formatTokenAmount = (value: bigint, decimals = 18, fractionDigits = 4, roundDown = true) => {
  return formatValue(formatUnits(value, decimals), fractionDigits, roundDown);
};

export const formatUSD = (value: number, fractionDigits = 2) => "$" + commify(Number(value).toFixed(fractionDigits));
