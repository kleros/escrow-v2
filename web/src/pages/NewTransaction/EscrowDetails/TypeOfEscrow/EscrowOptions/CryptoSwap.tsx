import React from "react";
import Logo from "svgs/icons/crypto-swap.svg";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { Card } from "@kleros/ui-components-library";
import { cn } from "src/utils";

const CryptoSwap: React.FC = () => {
  const { escrowType, setEscrowType } = useNewTransactionContext();

  const selected = escrowType === "swap";

  const handleSelect = () => {
    setEscrowType("swap");
  };

  return (
    <div className="flex flex-col gap-6 justify-center">
      <Card
        className={cn(
          "flex h-24 w-24 items-center justify-center cursor-pointer rounded-[20px]!",
          selected && "border border-klerosUIComponentsPrimaryBlue"
        )}
        onClick={handleSelect}
      >
        <Logo className="fill-klerosUIComponentsSecondaryPurple" />
      </Card>
      <p className="flex flex-wrap w-24 m-0 text-center px-2">Crypto Swap</p>
    </div>
  );
};
export default CryptoSwap;
