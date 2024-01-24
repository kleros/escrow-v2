import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useDisputeTimelineItems from "hooks/useDisputeTimelineItems";
import { StyledSkeleton } from "components/StyledSkeleton";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

const Timeline: React.FC = () => {
  const { buyer, seller, status, hasToPayFees, disputeRequest, resolvedEvents } = useTransactionDetailsContext();
  const items = useDisputeTimelineItems(buyer, seller, status, hasToPayFees, disputeRequest, resolvedEvents);

  return hasToPayFees && hasToPayFees.length !== 0 ? <StyledTimeline items={items} /> : <StyledSkeleton />;
};

export default Timeline;
