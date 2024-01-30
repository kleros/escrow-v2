import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useEscrowTimelineItems from "hooks/useEscrowTimelineItems";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface IEscrowTimeline {
  isPreview: boolean;
}

const EscrowTimeline: React.FC<IEscrowTimeline> = ({ isPreview }) => {
  const { timestamp, status, resolvedEvents, buyer, seller, hasToPayFees, disputeRequest } = useTransactionDetailsContext();

  const items = useEscrowTimelineItems(
    isPreview,
    timestamp,
    status,
    resolvedEvents,
    buyer,
    seller,
    hasToPayFees,
    disputeRequest
  );

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
