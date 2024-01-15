import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useEscrowTimelineItems from "hooks/useEscrowTimelineItems";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface IEscrowTimeline {
  creationTimestamp: string;
  isPreview: boolean;
}

const EscrowTimeline: React.FC<IEscrowTimeline> = ({ creationTimestamp, isPreview }) => {
  const items = isPreview
    ? useEscrowTimelineItems(creationTimestamp)
    : useEscrowTimelineItems(new Date(creationTimestamp * 1000).toLocaleString());

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
