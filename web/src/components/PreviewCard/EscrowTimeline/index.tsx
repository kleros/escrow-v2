import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useEscrowTimelineItems from "hooks/useEscrowTimelineItems";
import { TransactionDetailsFragment } from "src/graphql/graphql";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface IEscrowTimeline {
  transactionData?: TransactionDetailsFragment;
  isPreview: boolean;
}

const EscrowTimeline: React.FC<IEscrowTimeline> = ({ transactionData, isPreview }) => {
  const items = isPreview ? useEscrowTimelineItems({}, true) : useEscrowTimelineItems(transactionData, false);

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
