import { formatEther, formatUnits } from "viem";
import { commify } from "./commify";

export const roundNumberDown = (value: number, fractionDigits = 0) => {
  const factor = 10 ** fractionDigits;
  return Math.floor(value * factor) / factor;
};

export const formatUnitsWei = (value: bigint) => formatUnits(value, 18);

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

export const formatUSD = (value: number, fractionDigits = 2) => "$" + commify(Number(value).toFixed(fractionDigits));

//Use to format amounts received from NumberField components. Particularly useful when the value is in scientific notation.
export const formatNumberFieldAmount = (value: number) => {
  if (value === 0) return "0";

  const valueString = value.toString();

  if (valueString.includes("e") || valueString.includes("E")) {
    return value.toFixed(18).replace(/\.?0+$/, "");
  }

  return valueString;
};
