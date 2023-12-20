import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useDisputeTimelineItems from "hooks/useDisputeTimelineItems";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

const Timeline: React.FC = () => {
  const items = useDisputeTimelineItems(new Date());

  return <StyledTimeline items={items} />;
};

export default Timeline;
