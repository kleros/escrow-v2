import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import OpenModalProposeSettlementButton from "../WasItFulfilled/Buttons/OpenModalProposeSettlementButton";
import OpenModalRaiseDisputeButton from "components/OpenModalRaiseDisputeButton";
import AcceptButton from "./AcceptSettlementButton";
import ViewCaseButton from "./ViewCaseButton";
import RaiseDisputeButton from "./RaiseDisputeButton";
import TimeoutButton from "./TimeoutButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

interface IButtons {
  feeTimeout: number;
  settlementTimeout: number;
}

const Buttons: React.FC<IButtons> = ({ feeTimeout, settlementTimeout }) => {
  const { address } = useAccount();
  const { seller, buyer, status, settlementProposals, disputeRequest, hasToPayFees, resolvedEvents } =
    useTransactionDetailsContext();
  const connectedAddress = address?.toLowerCase();
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const shouldDisplayRaiseDisputeButton = shouldPayFee && !disputeRequest && resolvedEvents?.length === 0;

  const shouldDisplaySettlementButtons =
    hasToPayFees?.length === 0 &&
    isYourSettlementTurn &&
    status !== "Disputed" &&
    status !== "TransactionResolved" &&
    status !== "WaitingBuyer" &&
    status !== "WaitingSeller";

  const settlementTimeLeft =
    settlementTimeout - (currentTime - settlementProposals?.[settlementProposals.length - 1]?.timestamp);
  const feeTimeLeft = feeTimeout - (currentTime - hasToPayFees?.[0]?.timestamp);
  const isBuyer = address?.toLowerCase() === buyer?.toLowerCase();

  return (
    <>
      {shouldDisplaySettlementButtons ? (
        <Container>
          <AcceptButton />
          <OpenModalProposeSettlementButton buttonText="Counter-propose" />
          <OpenModalRaiseDisputeButton />
        </Container>
      ) : (status === "WaitingSettlementBuyer" || status === "WaitingSettlementSeller") && settlementTimeLeft <= 0 ? (
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
      {feeTimeLeft <= 0 && ((status === "WaitingSeller" && isBuyer) || (status === "WaitingBuyer" && !isBuyer)) ? (
        <Container>
          <TimeoutButton />
        </Container>
      ) : null}
    </>
  );
};

export default Buttons;
