import React from "react";
import { Field } from "@kleros/ui-components-library";
import styled from "styled-components";

const StyledField = styled(Field)`
  width: 100% !important;
  margin-bottom: 32px;
`;

interface IAmountField {
  amountProposed: string;
  setAmountProposed: () => void;
}

const AmountField: React.FC<IAmountField> = ({ amountProposed, setAmountProposed }) => {
  return (
    <StyledField
      value={amountProposed}
      onChange={(e) => setAmountProposed(e.target.value)}
      type="number"
      placeholder="0"
      // variant={error ? "error" : undefined}
      // message={error}
    />
  );
};
export default AmountField;
