import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";
import styled, { css } from "styled-components";
import { calcMinMax } from "utils/calcMinMax";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { landscapeStyle } from "styles/landscapeStyle";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 84vw;

  svg {
    width: 48px !important;
    height: 48px !important;
  }

  ${landscapeStyle(
    () => css`
      width: ${calcMinMax(342, 618)};
    `
  )}
`;

const Info: React.FC = () => {
  const { escrowType } = useNewTransactionContext();

  return (
    <Container>
      <AlertMessage
        variant="info"
        title={escrowType === "general" ? "General Escrow" : "Crypto Swap"}
        msg={
          escrowType === "general"
            ? "Hiring an outside contractor? Use the General Escrow to safeguard your transactions. Use this option if you want to define the agreement under your own terms."
            : "Want to protect your crypto transaction? Use this option to create a safe cross-chain swap. One person escrows an asset based on Ethereum and the funds are released once assets on another blockchain have been moved."
        }
      />
    </Container>
  );
};

export default Info;
