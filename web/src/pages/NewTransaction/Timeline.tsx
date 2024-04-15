import React from "react";
import styled, { css } from "styled-components";
import { Steps } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import { useLocation } from "react-router-dom";

const StyledSteps = styled(Steps)`
  display: none;

  ${landscapeStyle(
    () => css`
      display: flex;
      position: absolute;
      left: 4%;
      height: 200px;
    `
  )}
`;

const items = [
  { title: "Escrow Details", subitems: ["Type of Escrow", "Title"] },
  { title: "Terms", subitems: ["Deliverable", "Payment", "Deadline"] },
  { title: "Preview" },
];

const Timeline: React.FC = () => {
  const location = useLocation();

  const routeToIndexMap = {
    "/new-transaction/escrow-type": 0,
    "/new-transaction/title": 0,
    "/new-transaction/deliverable": 1,
    "/new-transaction/payment": 1,
    "/new-transaction/deadline": 1,
    "/new-transaction/notifications": 1,
    "/new-transaction/preview": 2,
  };

  const currentItemIndex = Object.entries(routeToIndexMap).reduce(
    (acc, [route, index]) => (location.pathname.includes(route) ? index : acc),
    0
  );

  return <StyledSteps {...{ items, currentItemIndex }} />;
};

export default Timeline;
