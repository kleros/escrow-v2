import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useDisputeTimelineItems from "hooks/useDisputeTimelineItems";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { StyledSkeleton } from "components/StyledSkeleton";
import { isUndefined } from "utils/index";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface ITimeline {
  transactionData: TransactionDetailsFragment;
}

const Timeline: React.FC<ITimeline> = ({ transactionData }) => {
  const items = useDisputeTimelineItems(transactionData);

  return !isUndefined(transactionData) ? <StyledTimeline items={items} /> : <StyledSkeleton />;
};

export default Timeline;
