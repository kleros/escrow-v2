import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import ProposeSettlementButton from "pages/MyTransactions/TransactionDetails/PreviewCardButtons/ProposeSettlementButton";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

interface IButtons {
  toggleModal: () => void;
  amountProposed: string;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, amountProposed }) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onClick={toggleModal} />
      <ProposeSettlementButton buttonText="Propose" {...{ toggleModal, amountProposed }} />
    </Container>
  );
};
export default Buttons;
