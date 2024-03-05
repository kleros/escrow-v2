import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Field } from "@kleros/ui-components-library";
import { parseEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

export const StyledField = styled(Field)`
  width: 100% !important;
  margin-bottom: ${responsiveSize(64, 36)};
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input {
    font-size: 16px;
  }
`;

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
    <StyledField
      value={amountProposed}
      onChange={(e) => setAmountProposed(e.target.value)}
      type="number"
      placeholder="0"
      variant={error ? "error" : undefined}
      message={error}
    />
  );
};

export default AmountField;
