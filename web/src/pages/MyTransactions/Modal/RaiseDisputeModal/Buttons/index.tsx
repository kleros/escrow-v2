import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import RaiseDisputeButton from "pages/MyTransactions/TransactionDetails/PreviewCardButtons/RaiseDisputeButton";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

interface IButtons {
  toggleModal: () => void;
  arbitrationCost: bigint;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, arbitrationCost }) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onPress={toggleModal} />
      <RaiseDisputeButton buttonText="Raise a dispute" {...{ toggleModal, arbitrationCost }} />
    </Container>
  );
};
export default Buttons;
