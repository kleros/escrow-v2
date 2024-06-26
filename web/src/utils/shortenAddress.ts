import { getAddress } from "viem";

export function shortenAddress(address: string): string {
  if (!address) return "";

  if (address.endsWith(".eth")) {
    return address;
  }

  try {
    const formattedAddress = getAddress(address);
    return formattedAddress.substring(0, 6) + "..." + formattedAddress.substring(formattedAddress.length - 4);
  } catch {
    throw new TypeError("Invalid input, address can't be parsed");
  }
}
