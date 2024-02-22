import React from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import AcceptButton from "./AcceptSettlementButton";
import OpenModalRaiseDisputeButton from "components/OpenModalRaiseDisputeButton";
import ViewCaseButton from "./ViewCaseButton";
import RaiseDisputeButton from "./RaiseDisputeButton";
import OpenModalProposeSettlementButton from "../WasItFulfilled/Buttons/OpenModalProposeSettlementButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

const Buttons: React.FC = () => {
  const { address } = useAccount();
  const { seller, buyer, status, settlementProposals, disputeRequest, hasToPayFees, lastFeePaymentTime } =
    useTransactionDetailsContext();
  const connectedAddress = address?.toLowerCase();
  const currentTimeUnixSeconds = Math.floor(Date.now() / 1000);
  const settlementTimeout = 600; //hardcoded for now, make it dynamic from subgraph

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

  const lastSettlementProposal = settlementProposals?.[settlementProposals.length - 1];
  const isYourSettlementTurn = lastSettlementProposal
    ? (() => {
        const partyThatProposed = lastSettlementProposal.party;
        if (partyThatProposed === "1" && connectedAddress === seller.toLowerCase()) {
          return true;
        }
        if (partyThatProposed === "2" && connectedAddress === buyer.toLowerCase()) {
          return true;
        }
        return false;
      })()
    : false;

  const shouldDisplayRaiseDisputeButton = shouldPayFee && !disputeRequest;

  const shouldDisplaySettlementButtons =
    hasToPayFees?.length === 0 &&
    isYourSettlementTurn &&
    status !== "Disputed" &&
    status !== "TransactionResolved" &&
    status !== "WaitingBuyer" &&
    status !== "WaitingSeller";

  console.log(currentTimeUnixSeconds - lastFeePaymentTime);

  return (
    <>
      {shouldDisplaySettlementButtons ? (
        <Container>
          <AcceptButton />
          <OpenModalProposeSettlementButton buttonText="Counter-propose" />
          <OpenModalRaiseDisputeButton />
        </Container>
      ) : (status === "WaitingSettlementBuyer" || status === "WaitingSettlementSeller") &&
        currentTimeUnixSeconds - lastFeePaymentTime > settlementTimeout ? (
        <OpenModalRaiseDisputeButton />
      ) : null}

      {shouldDisplayRaiseDisputeButton ? (
        <Container>
          <RaiseDisputeButton buttonText={`Deposit the fee: ${formatEther(BigInt("30000000000000"))} ETH`} />
        </Container>
      ) : null}
      {disputeRequest ? (
        <Container>
          <ViewCaseButton />
        </Container>
      ) : null}
    </>
  );
};

export default Buttons;
