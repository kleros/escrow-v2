import React from "react";
import { Field } from "@kleros/ui-components-library";
import styled, { css } from "styled-components";
import { responsiveSize } from "utils/responsiveSize";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { landscapeStyle } from "styles/landscapeStyle";

const StyledField = styled(Field)`
  width: 84vw;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 700)};
    `
  )}
`;

const InputField: React.FC = () => {
  const { escrowTitle, setEscrowTitle } = useNewTransactionContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEscrowTitle(event.target.value);
  };

  return <StyledField value={escrowTitle} onChange={handleWrite} placeholder="e.g. Escrow with John" />;
};

export default InputField;
