import React from "react";
import styled, { css } from "styled-components"
import { landscapeStyle } from "styles/landscapeStyle"
import { Field } from "@kleros/ui-components-library";

const StyledField = styled(Field)`
  width: 60vw;

  ${landscapeStyle(
    () => css`
      width: 278px;
    `
  )}
`

interface IAmount {
  quantity: string;
  setQuantity: (value: string) => void;
}

const Amount: React.FC<IAmount> = ({ quantity, setQuantity }) => {
  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  return <StyledField value={quantity} onChange={handleWrite} type="number" placeholder="eg. 3.6" />;
};
export default Amount;
