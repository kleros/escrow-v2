import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useSettlementTimelineItems from "hooks/useSettlementTimelineItems";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

const Timeline: React.FC = () => {
  const items = useSettlementTimelineItems(new Date());

  return <StyledTimeline items={items} />;
};

export default Timeline;
