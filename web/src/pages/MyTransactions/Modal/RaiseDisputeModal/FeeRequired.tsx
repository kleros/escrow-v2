import React from "react";
import { Card } from "@kleros/ui-components-library";
import { formatEther } from "viem";
import clsx from "clsx";

interface IFeeRequired {
  arbitrationCost: bigint;
}

const FeeRequired: React.FC<IFeeRequired> = ({ arbitrationCost }) => {
  return (
    <Card
      className={clsx(
        "flex flex-col gap-1.5 justify-center items-center",
        "bg-klerosUIComponentsMediumBlue border-none",
        "w-full h-[87px] p-4"
      )}
    >
      <p className="m-0 text-sm text-klerosUIComponentsPrimaryBlue">Arbitration fee required</p>
      {arbitrationCost ? (
        <p className="m-0 text-2xl font-semibold text-klerosUIComponentsPrimaryBlue">
          {formatEther(arbitrationCost)} ETH
        </p>
      ) : null}
    </Card>
  );
};
export default FeeRequired;
