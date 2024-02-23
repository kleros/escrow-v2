import React from "react";
import styled from "styled-components";
import OpenModalProposeSettlementButton from "./OpenModalProposeSettlementButton";
import ReleasePaymentButton from "./ReleasePaymentButton";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import ClaimFullPaymentButton from "./ClaimFullPaymentButton";

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
  const { buyer, payments, deadline } = useTransactionDetailsContext();
  const isBuyer = address?.toLowerCase() === buyer?.toLowerCase();
  const currentTimeUnixSeconds = Math.floor(Date.now() / 1000);

  return (
    <Container>
      {isBuyer && payments?.length === 0 ? <ReleasePaymentButton /> : null}
      {currentTimeUnixSeconds < deadline ? (
        <OpenModalProposeSettlementButton buttonText="Propose a settlement" />
      ) : null}
      {currentTimeUnixSeconds > deadline && !isBuyer ? <ClaimFullPaymentButton /> : null}
    </Container>
  );
};
export default Buttons;
