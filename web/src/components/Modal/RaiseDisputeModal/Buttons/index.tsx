import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import RaiseDisputeButton from "./RaiseDisputeButton";

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

interface IButtons {
  toggleModal: () => void;
}

const Buttons: React.FC<IButtons> = ({ toggleModal }) => {
  return (
    <Container>
      <Button variant="secondary" text="Return" onClick={toggleModal} />
      <RaiseDisputeButton toggleModal={toggleModal} />
    </Container>
  );
};
export default Buttons;
