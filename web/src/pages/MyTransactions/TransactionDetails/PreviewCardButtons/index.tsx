import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import OpenModalProposeSettlementButton from "../WasItFulfilled/Buttons/OpenModalProposeSettlementButton";
import OpenModalRaiseDisputeButton from "components/OpenModalRaiseDisputeButton";
import AcceptButton from "./AcceptSettlementButton";
import ViewCaseButton from "./ViewCaseButton";
import RaiseDisputeButton from "./RaiseDisputeButton";
import TimeOutButton from "./TimeOutButton";
import ExecuteTransactionButton from "./ExecuteTransactionButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

interface IPreviewCardButtons {
  feeTimeout: number;
  settlementTimeout: number;
  arbitrationCost: bigint;
}

const PreviewCardButtons: React.FC<IPreviewCardButtons> = ({ feeTimeout, settlementTimeout, arbitrationCost }) => {
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

  const isBuyer = useMemo(() => address?.toLowerCase() === buyer?.toLowerCase(), [address, buyer]);

  const shouldPayFee = useMemo(
    () =>
      hasToPayFees?.some((fee) => {
        const partyRequiredToPay = fee.party;
        if (partyRequiredToPay === "1" && connectedAddress === buyer.toLowerCase()) {
          return true;
        }
        if (partyRequiredToPay === "2" && connectedAddress === seller.toLowerCase()) {
          return true;
        }
        return false;
      }),
    [hasToPayFees, connectedAddress, buyer, seller]
  );

  const lastSettlementProposal = useMemo(
    () => settlementProposals?.[settlementProposals.length - 1],
    [settlementProposals]
  );
  const isYourSettlementTurn = useMemo(
    () =>
      lastSettlementProposal
        ? (lastSettlementProposal.party === "1" && connectedAddress === seller.toLowerCase()) ||
          (lastSettlementProposal.party === "2" && connectedAddress === buyer.toLowerCase())
        : false,
    [lastSettlementProposal, connectedAddress, buyer, seller]
  );

  const shouldDisplayRaiseDisputeButton = useMemo(
    () => shouldPayFee && !disputeRequest && resolvedEvents?.length === 0,
    [shouldPayFee, disputeRequest, resolvedEvents]
  );

  const shouldDisplaySettlementButtons = useMemo(
    () =>
      hasToPayFees?.length === 0 &&
      isYourSettlementTurn &&
      !["Disputed", "TransactionResolved", "WaitingBuyer", "WaitingSeller"].includes(status),
    [hasToPayFees, isYourSettlementTurn, status]
  );

  const settlementTimeLeft = useMemo(
    () => settlementTimeout - (currentTime - lastSettlementProposal?.timestamp),
    [settlementTimeout, currentTime, lastSettlementProposal]
  );
  const feeTimeLeft = useMemo(
    () => feeTimeout - (currentTime - hasToPayFees?.[0]?.timestamp),
    [feeTimeout, currentTime, hasToPayFees]
  );

  const shouldDisplayExecuteTransactionButton = useMemo(
    () => status === "NoDispute" && currentTime >= settlementTimeout,
    [status, currentTime, settlementTimeout]
  );

  return (
    <>
      {shouldDisplaySettlementButtons ? (
        <Container>
          <AcceptButton />
          <OpenModalProposeSettlementButton buttonText="Counter-propose" />
          <OpenModalRaiseDisputeButton {...{ arbitrationCost }} />
        </Container>
      ) : null}

      {shouldDisplayRaiseDisputeButton && arbitrationCost ? (
        <Container>
          <RaiseDisputeButton
            buttonText={`Deposit the fee: ${formatEther(arbitrationCost)} ETH`}
            {...{ arbitrationCost }}
          />
        </Container>
      ) : null}
      {disputeRequest ? (
        <Container>
          <ViewCaseButton />
        </Container>
      ) : null}
      {settlementTimeLeft <= 0 &&
      ((status === "WaitingSettlementSeller" && isBuyer) || (status === "WaitingSettlementBuyer" && !isBuyer)) ? (
        <OpenModalRaiseDisputeButton {...{ arbitrationCost }} />
      ) : null}
      {feeTimeLeft <= 0 && ((status === "WaitingSeller" && isBuyer) || (status === "WaitingBuyer" && !isBuyer)) ? (
        <Container>
          <TimeOutButton />
        </Container>
      ) : null}
      {shouldDisplayExecuteTransactionButton ? (
        <Container>
          <ExecuteTransactionButton />
        </Container>
      ) : null}
    </>
  );
};

export default PreviewCardButtons;
