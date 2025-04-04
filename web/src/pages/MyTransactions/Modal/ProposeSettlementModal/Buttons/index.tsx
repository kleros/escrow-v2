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
  isAmountValid: boolean;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, amountProposed, isAmountValid }) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onPress={toggleModal} />
      <ProposeSettlementButton buttonText="Propose" {...{ toggleModal, amountProposed, isAmountValid }} />
    </Container>
  );
};

export default Buttons;
