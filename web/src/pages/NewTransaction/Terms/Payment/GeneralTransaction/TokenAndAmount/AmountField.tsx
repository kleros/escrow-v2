import React from "react";
import styled from "styled-components";
import { BigNumberField } from "@kleros/ui-components-library";

const StyledField = styled(BigNumberField)`
  width: 186px;
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
    padding-right: ${({ variant }) => (variant ? "40px" : "16px")};
  }
`;

interface IAmountField {
  quantity: string;
  setQuantity: (value: string) => void;
  error: string;
}

const AmountField: React.FC<IAmountField> = ({ quantity, setQuantity, error }) => {
  return (
    <StyledField
      value={quantity}
      onChange={(val) => {
        setQuantity(val.toString());
      }}
      placeholder="Amount"
      variant={error ? "error" : undefined}
      message={error}
    />
  );
};

export default AmountField;
