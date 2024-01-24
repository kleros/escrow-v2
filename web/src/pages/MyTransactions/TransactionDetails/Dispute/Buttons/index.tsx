import React from "react";
import styled from "styled-components";
import ViewCaseButton from "./ViewCaseButton";
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
  const connectedAddress = address?.toLowerCase();
  const { buyer, seller, disputeRequest, hasToPayFees } = useTransactionDetailsContext();

  const shouldPayFee = hasToPayFees?.some((fee) => {
    const partyRequiredToPay = fee.party;
    if (partyRequiredToPay === "1" && connectedAddress === buyer.toLowerCase()) {
      return true;
    }
    if (partyRequiredToPay === "2" && connectedAddress === seller.toLowerCase()) {
      return true;
    }
    return false;
  });

  const shouldDisplayRaiseDisputeButton = shouldPayFee && !disputeRequest;

  return (
    <Container>
      {shouldDisplayRaiseDisputeButton && <RaiseDisputeButton />}
      {disputeRequest && <ViewCaseButton />}
    </Container>
  );
};
export default Buttons;
