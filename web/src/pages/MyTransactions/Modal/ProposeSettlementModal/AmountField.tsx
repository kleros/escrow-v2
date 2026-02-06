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
  const [error, setError] = useState("");
  const tokenDecimals = tokenMetadata?.decimals;
  const isDecimalsLoading = !!token && tokenMetadata === undefined;
  const isDecimalsError = !!token && tokenMetadata === null;
  const isDecimalsMissing = !!token && !!tokenMetadata && tokenDecimals === undefined;

  useEffect(() => {
    //Don't validate until decimals are loaded for ERC20 transactions
    if (isDecimalsLoading) {
      setError("");
      setIsAmountValid(false);
      return;
    }

    if (isDecimalsError || isDecimalsMissing) {
      setError("Unable to load token metadata");
      setIsAmountValid(false);
      return;
    }

    const transactionAmount = typeof amount === "bigint" ? amount : amount ? BigInt(amount) : 0n;

    let parsedAmount: bigint;
    try {
      parsedAmount = amountProposed ? parseUnits(amountProposed, tokenDecimals ?? 18) : 0n;
    } catch {
      setError("Invalid amount format");
      setIsAmountValid(false);
      return;
    }

    if (amountProposed && parsedAmount > transactionAmount) {
      setError("Proposed amount exceeds transaction amount");
      setIsAmountValid(false);
    } else {
      setError("");
      setIsAmountValid(true);
    }
  }, [amountProposed, amount, setIsAmountValid, tokenDecimals, isDecimalsLoading, isDecimalsError, isDecimalsMissing]);

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
