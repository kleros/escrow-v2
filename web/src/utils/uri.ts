import { useLocation } from "react-router-dom";
import { Escrow_Filter } from "src/graphql/graphql";

export const encodeURIFilter = (filter: Escrow_Filter): string => {
  if (Object.keys(filter).length === 0) {
    return "all";
  } else {
    return encodeURI(JSON.stringify(filter));
  }
};

export const decodeURIFilter = (filter: string): Escrow_Filter => {
  if (filter === "all") {
    return {};
  } else {
    return JSON.parse(decodeURI(filter));
  }
};

export const useRootPath = () => {
  const location = useLocation();
  return location.pathname.split("/").slice(0, -3).join("/");
};
