import React from "react";
import Skeleton from "react-loading-skeleton";
import { isUndefined } from "utils/index";
import clsx from "clsx";

interface IMaxBalance {
  formattedBalance?: string;
  rawBalance: number;
  setQuantity: (value: string) => void;
}

const MaxBalance: React.FC<IMaxBalance> = ({ formattedBalance, rawBalance, setQuantity }) => {
  return (
    <div className="flex flex-row self-center gap-1 lg:self-end">
      <div className="flex flex-row gap-1">
        <p className="m-0 text-xs text-klerosUIComponentsSecondaryText">Balance:</p>
        {isUndefined(formattedBalance) ? (
          <Skeleton width={63} height={16} />
        ) : (
          <p className="m-0 text-xs">{formattedBalance}</p>
        )}
      </div>
      {!isUndefined(formattedBalance) ? (
        <p
          className={clsx(
            "cursor-pointer m-0",
            "text-xs text-klerosUIComponentsPrimaryBlue hover:text-klerosUIComponentsSecondaryBlue",
            "transition duration-100"
          )}
          onClick={() => setQuantity(String(rawBalance))}
        >
          Max
        </p>
      ) : null}
    </div>
  );
};
export default MaxBalance;
