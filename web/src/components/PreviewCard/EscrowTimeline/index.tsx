import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useEscrowTimelineItems from "hooks/useEscrowTimelineItems";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface IEscrowTimeline {
  isPreview: boolean;
  transactionCreationTimestamp: number;
  status: boolean;
  asset: string;
  buyerAddress: string;
  sellerAddress: string;
  payments: [];
  settlementProposals: [];
  hasToPayFees: [];
  disputeRequest: [];
  resolvedEvents: [];
}

const EscrowTimeline: React.FC<IEscrowTimeline> = ({
  isPreview,
  transactionCreationTimestamp,
  status,
  asset,
  buyerAddress,
  sellerAddress,
  payments,
  settlementProposals,
  hasToPayFees,
  disputeRequest,
  resolvedEvents,
}) => {
  const items = useEscrowTimelineItems(
    isPreview,
    transactionCreationTimestamp,
    status,
    asset,
    buyerAddress,
    sellerAddress,
    payments,
    settlementProposals,
    hasToPayFees,
    disputeRequest,
    resolvedEvents
  );

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
