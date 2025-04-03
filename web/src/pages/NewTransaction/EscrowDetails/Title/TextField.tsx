import React from "react";
import { TextField } from "@kleros/ui-components-library";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { landscapeStyle } from "styles/landscapeStyle";

const StyledField = styled(TextField)`
  width: 84vw;
  input {
    font-size: 16px;
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 500)};
    `
  )}
`;

const InputField: React.FC = () => {
  const { escrowTitle, setEscrowTitle } = useNewTransactionContext();

  const handleWrite = (val: string) => {
    setEscrowTitle(val);
  };

  return <StyledField value={escrowTitle} onChange={handleWrite} placeholder="e.g. Escrow with John" />;
};

export default InputField;
