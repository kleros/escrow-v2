import React from "react";
import styled from "styled-components";
import AcceptButton from "./AcceptButton";
import CounterProposeButton from "./CounterProposeButton";
import RaiseDisputeButton from "../../Overview/WasItFulfilled/Buttons/RaiseDisputeButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

const Buttons: React.FC = () => {
  return (
    <Container>
      <AcceptButton />
      <CounterProposeButton />
      <RaiseDisputeButton />
    </Container>
  );
};
export default Buttons;
