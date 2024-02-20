import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useEscrowTimelineItems from "hooks/useEscrowTimelineItems";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface IEscrowTimeline {
  isPreview: boolean;
  status: boolean;
  transactionCreationTimestamp: number;
  buyerAddress: string;
  sellerAddress: string;
  hasToPayFees: [];
  disputeRequest: [];
  resolvedEvents: [];
}

const EscrowTimeline: React.FC<IEscrowTimeline> = ({
  isPreview,
  transactionCreationTimestamp,
  status,
  buyerAddress,
  sellerAddress,
  hasToPayFees,
  disputeRequest,
  resolvedEvents,
}) => {
  const items = useEscrowTimelineItems(
    isPreview,
    transactionCreationTimestamp,
    status,
    buyerAddress,
    sellerAddress,
    hasToPayFees,
    disputeRequest,
    resolvedEvents
  );

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
