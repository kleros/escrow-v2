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
      aria-label="Amount"
      className="w-full mb-fluid-64-36"
      value={Number(amountProposed)}
      onChange={(value) => setAmountProposed(value.toString())}
      placeholder="0"
      variant={error ? "error" : undefined}
      message={error}
      showFieldError
      minValue={0}
      formatOptions={{
        //Prevent automatic rounding of very small amounts
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }}
    />
  );
};

export default AmountField;
