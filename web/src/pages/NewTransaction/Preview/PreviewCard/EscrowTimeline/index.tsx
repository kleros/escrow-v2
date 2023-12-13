import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useItems from "hooks/useEscrowTimelineItems";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

const EscrowTimeline: React.FC = () => {
  const items = useItems(new Date());

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
