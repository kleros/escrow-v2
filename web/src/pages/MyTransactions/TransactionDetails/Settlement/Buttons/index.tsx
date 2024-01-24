import React from "react";
import styled from "styled-components";
import AcceptButton from "./AcceptButton";
import CounterProposeButton from "./CounterProposeButton";
import RaiseDisputeButton from "../../Overview/WasItFulfilled/Buttons/RaiseDisputeButton";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

const Buttons: React.FC = () => {
  const { address } = useAccount();
  const { status, buyer, seller } = useTransactionDetailsContext();
  const isBuyer = address?.toLowerCase() === buyer?.toLowerCase();
  const isSeller = address?.toLowerCase() === seller?.toLowerCase();

  const showAcceptButton = status === "WaitingBuyer" && isBuyer;
  const showCounterProposeButton = status === "WaitingSeller" && isSeller;
  const showRaiseDisputeButton = status && ["WaitingBuyer", "WaitingSeller"].includes(status);

  return (
    <Container>
      {showAcceptButton && <AcceptButton />}
      {showCounterProposeButton && <CounterProposeButton />}
      {showRaiseDisputeButton && <RaiseDisputeButton />}
    </Container>
  );
};

export default Buttons;
