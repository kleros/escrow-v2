import React from "react";
import styled from "styled-components";
import AcceptButton from "./AcceptButton";
import CounterProposeButton from "./CounterProposeButton";
import RaiseDisputeButton from "../../Overview/WasItFulfilled/Buttons/RaiseDisputeButton";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { useAccount } from "wagmi";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

interface IButtons {
  transactionData: TransactionDetailsFragment;
}

const Buttons: React.FC<IButtons> = ({ transactionData }) => {
  const { address } = useAccount();
  const isBuyer = address?.toLowerCase() === transactionData?.buyer?.toLowerCase();
  const isSeller = address?.toLowerCase() === transactionData?.seller?.toLowerCase();

  const showAcceptButton = transactionData?.status === "WaitingBuyer" && isBuyer;
  const showCounterProposeButton = transactionData?.status === "WaitingSeller" && isSeller;
  const showRaiseDisputeButton =
    transactionData?.status && ["WaitingBuyer", "WaitingSeller"].includes(transactionData?.status);

  return (
    <Container>
      {showAcceptButton && <AcceptButton transactionData={transactionData} />}
      {showCounterProposeButton && <CounterProposeButton transactionData={transactionData} />}
      {showRaiseDisputeButton && <RaiseDisputeButton transactionData={transactionData} />}
    </Container>
  );
};

export default Buttons;
