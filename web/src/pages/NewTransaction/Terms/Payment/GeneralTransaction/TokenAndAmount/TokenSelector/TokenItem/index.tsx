import React from "react";
import Balance from "./Balance";
import TokenIcon from "./TokenIcon";
import { cn } from "src/utils";

const TokenItem = ({ token, selected, onSelect }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "transition duration-100 cursor-pointer py-2.5 px-4",
        "hover:bg-klerosUIComponentsLightBlue",
        selected
          ? "bg-klerosUIComponentsMediumBlue border-l-[3px] border-klerosUIComponentsPrimaryBlue pl-3"
          : "bg-transparent border-none pl-4"
      )}
      onClick={() => onSelect(token)}
    >
      <div className="flex items-center gap-2">
        <TokenIcon symbol={token.symbol} logo={token.logo} />
        <span className="text-klerosUIComponentsPrimaryText">{token.symbol}</span>
      </div>
      <Balance {...{ token }} />
    </div>
  );
};

export default TokenItem;
