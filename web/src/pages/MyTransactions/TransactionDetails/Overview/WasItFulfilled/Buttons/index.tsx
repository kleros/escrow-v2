import React from "react";
import styled from "styled-components";
import ProposeSettlementButton from "./ProposeSettlementButton";
import RaiseDisputeButton from "components/OpenModalRaiseDisputeButton";
import ReleasePaymentButton from "./ReleasePaymentButton";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 24px;
  justify-content: center;
`;

const Buttons: React.FC = () => {
  const { address } = useAccount();
  const { buyer } = useTransactionDetailsContext();
  const isBuyer = address?.toLowerCase() === buyer?.toLowerCase();

  return (
    <Container>
      {isBuyer ? <ReleasePaymentButton /> : null}
      {/* <ProposeSettlementButton /> */}
      <RaiseDisputeButton />
    </Container>
  );
};
export default Buttons;
