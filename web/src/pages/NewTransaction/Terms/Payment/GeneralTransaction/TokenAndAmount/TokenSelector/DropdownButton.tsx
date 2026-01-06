import React from "react";
import Skeleton from "react-loading-skeleton";
import TokenIcon from "./TokenItem/TokenIcon";
import clsx from "clsx";

export const DropdownButton = ({ loading, sendingToken, onClick }) => {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-between",
        "h-[45px] w-48 py-2.5 px-3.5",
        "cursor-pointer transition duration-100",
        "border rounded-[3px] border-klerosUIComponentsStroke",
        "text-klerosUIComponentsPrimaryText",
        "bg-klerosUIComponentsWhiteBackground hover:bg-klerosUIComponentsLightGrey"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <Skeleton className="rounded-full mb-0.5" width={24} height={24} />
        ) : (
          <TokenIcon symbol={sendingToken.symbol} logo={sendingToken.logo} />
        )}
        {loading ? <Skeleton width={40} height={16} /> : sendingToken?.symbol}
      </div>
      <span className="inline-block ml-2 p-1 border-r border-b border-klerosUIComponentsStroke rotate-45" />
    </div>
  );
};
