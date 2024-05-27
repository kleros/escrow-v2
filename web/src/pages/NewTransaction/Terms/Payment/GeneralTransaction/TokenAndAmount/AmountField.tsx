import React from "react";
import styled from "styled-components";
import { Field } from "@kleros/ui-components-library";

const StyledField = styled(Field)`
  width: 132px;
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
  quantity: string;
  setQuantity: (value: string) => void;
  error: string;
}

const AmountField: React.FC<IAmountField> = ({ quantity, setQuantity, error }) => {
  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  return (
    <StyledField
      value={quantity}
      onChange={handleWrite}
      type="number"
      placeholder="Amount"
      variant={error ? "error" : undefined}
      message={error}
    />
  );
};

export default AmountField;
