import React, { useState, useEffect } from "react";
import { BigNumberField } from "@kleros/ui-components-library";
import { parseUnits } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { useTokenMetadata } from "hooks/useTokenMetadata";

interface IAmountField {
  amountProposed: string;
  setAmountProposed: (value: string) => void;
  setIsAmountValid: (isValid: boolean) => void;
}

const AmountField: React.FC<IAmountField> = ({ amountProposed, setAmountProposed, setIsAmountValid }) => {
  const { amount, token } = useTransactionDetailsContext();
  const { tokenMetadata } = useTokenMetadata(token);
  const tokenDecimals = tokenMetadata?.decimals ?? 18;
  const [error, setError] = useState("");

  useEffect(() => {
    const transactionAmount = typeof amount === "bigint" ? amount : amount ? BigInt(amount) : 0n;
    const proposedAmount = amountProposed ? parseUnits(amountProposed, tokenDecimals) : 0n;

    if (amountProposed && proposedAmount > transactionAmount) {
      setError("Proposed amount exceeds transaction amount");
      setIsAmountValid(false);
    } else {
      setError("");
      setIsAmountValid(true);
    }
  }, [amountProposed, amount, setIsAmountValid, tokenDecimals]);

  return (
    <BigNumberField
      aria-label="Amount"
      className="w-full mb-fluid-64-36"
      value={amountProposed}
      onChange={(value) => setAmountProposed(value.toString())}
      placeholder="0"
      variant={error ? "error" : undefined}
      message={error}
      showFieldError
      minValue="0"
    />
  );
};

export default AmountField;
