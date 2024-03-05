export const resolutionToString = (resolutionValue: number): string => {
  switch (resolutionValue) {
    case 0:
      return "Transaction Executed";
    case 1:
      return "Timeout By Buyer";
    case 2:
      return "Timeout By Seller";
    case 3:
      return "Ruling Enforced";
    case 4:
      return "Settlement Reached";
    default:
      return "Unknown";
  }
};
