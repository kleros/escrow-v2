import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import RaiseDisputeButton from "./RaiseDisputeButton";
import { TransactionDetailsFragment } from "src/graphql/graphql";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

interface IButtons {
  toggleModal: () => void;
  transactionData: TransactionDetailsFragment;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, transactionData }) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onClick={toggleModal} />
      <RaiseDisputeButton transactionData={transactionData} toggleModal={toggleModal} />
    </Container>
  );
};
export default Buttons;
