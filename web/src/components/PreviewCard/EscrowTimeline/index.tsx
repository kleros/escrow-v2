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
  const { timestamp, status, resolvedEvents } = useTransactionDetailsContext();

  const items = isPreview
    ? useEscrowTimelineItems(true)
    : useEscrowTimelineItems(false, timestamp, status, resolvedEvents);

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
