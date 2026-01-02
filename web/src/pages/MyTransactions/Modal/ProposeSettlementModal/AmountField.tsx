import React, { useState, useEffect } from "react";
import { NumberField } from "@kleros/ui-components-library";
import { parseEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

interface IAmountField {
  amountProposed: string;
  setAmountProposed: (value: string) => void;
  setIsAmountValid: (isValid: boolean) => void;
}

const AmountField: React.FC<IAmountField> = ({ amountProposed, setAmountProposed, setIsAmountValid }) => {
  const { amount } = useTransactionDetailsContext();
  const [error, setError] = useState("");

  useEffect(() => {
    const transactionAmount = parseFloat(amount);
    const proposedAmount = parseEther(amountProposed);

    if (amountProposed && transactionAmount < proposedAmount) {
      setError("Proposed amount exceeds transaction amount");
      setIsAmountValid(false);
    } else {
      setError("");
      setIsAmountValid(true);
    }
  }, [amountProposed, amount, setIsAmountValid]);

  return (
    <NumberField
      className="w-full mb-fluid-64-36"
      value={Number(amountProposed)}
      onChange={(value) => setAmountProposed(value.toString())}
      placeholder="0"
      variant={error ? "error" : undefined}
      message={error}
    />
  );
};

export default AmountField;
