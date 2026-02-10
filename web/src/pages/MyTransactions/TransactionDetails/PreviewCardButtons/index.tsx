import React, { useEffect, useState, useMemo } from "react";
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

const containerStyle = "flex flex-wrap gap-6";

interface IPreviewCardButtons {
  feeTimeout: number;
  settlementTimeout: number;
  arbitrationCost: bigint;
}

const PreviewCardButtons: React.FC<IPreviewCardButtons> = ({ feeTimeout, settlementTimeout, arbitrationCost }) => {
  const { address } = useAccount();
  const { seller, buyer, status, deadline, settlementProposals, disputeRequest, hasToPayFees, resolvedEvents } =
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
  const isSeller = useMemo(() => address?.toLowerCase() === seller?.toLowerCase(), [address, seller]);

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
    () => status === "NoDispute" && currentTime >= Number(deadline),
    [status, currentTime, settlementTimeout]
  );

  return (
    <>
      {shouldDisplaySettlementButtons ? (
        <div className={containerStyle}>
          <AcceptButton />
          <OpenModalProposeSettlementButton buttonText="Counter-propose" />
          <OpenModalRaiseDisputeButton {...{ arbitrationCost }} />
        </div>
      ) : null}

      {shouldDisplayRaiseDisputeButton && arbitrationCost ? (
        <div className={containerStyle}>
          <RaiseDisputeButton
            buttonText={`Deposit the fee: ${formatEther(arbitrationCost)} ETH`}
            {...{ arbitrationCost }}
          />
        </div>
      ) : null}
      {disputeRequest ? (
        <div className={containerStyle}>
          <ViewCaseButton />
        </div>
      ) : null}
      {settlementTimeLeft <= 0 &&
        ((status === "WaitingSettlementSeller" && isBuyer) || (status === "WaitingSettlementBuyer" && isSeller)) ? (
        <OpenModalRaiseDisputeButton {...{ arbitrationCost }} />
      ) : null}
      {feeTimeLeft <= 0 && ((status === "WaitingSeller" && isBuyer) || (status === "WaitingBuyer" && isSeller)) ? (
        <div className={containerStyle}>
          <TimeOutButton />
        </div>
      ) : null}
      {shouldDisplayExecuteTransactionButton ? (
        <div className={containerStyle}>
          <ExecuteTransactionButton />
        </div>
      ) : null}
    </>
  );
};

export default PreviewCardButtons;
