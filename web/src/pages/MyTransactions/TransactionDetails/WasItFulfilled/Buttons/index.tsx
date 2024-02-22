import React from "react";
import styled from "styled-components";
import OpenModalProposeSettlementButton from "./OpenModalProposeSettlementButton";
import ReleasePaymentButton from "./ReleasePaymentButton";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 24px;
  justify-content: center;
  margin-bottom: 32px;
`;

const Buttons: React.FC = () => {
  const { address } = useAccount();
  const { buyer, payments } = useTransactionDetailsContext();
  const isBuyer = address?.toLowerCase() === buyer?.toLowerCase();

  return (
    <Container>
      {isBuyer && payments?.length === 0 ? <ReleasePaymentButton /> : null}
      <OpenModalProposeSettlementButton buttonText="Propose a settlement" />
    </Container>
  );
};
export default Buttons;
