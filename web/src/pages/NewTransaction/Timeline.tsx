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
  { title: "Terms", subitems: ["Deliverable", "Payment", "Deadline", "Notifications"] },
  { title: "Preview" },
];

const Timeline: React.FC = () => {
  const location = useLocation();

  const routeToIndexMap = {
    "/newTransaction/typeOfEscrow": 0,
    "/newTransaction/title": 0,
    "/newTransaction/deliverable": 1,
    "/newTransaction/payment": 1,
    "/newTransaction/deadline": 1,
    "/newTransaction/notifications": 1,
    "/newTransaction/preview": 2,
  };

  const currentItemIndex = Object.entries(routeToIndexMap).reduce(
    (acc, [route, index]) => (location.pathname.includes(route) ? index : acc),
    0
  );

  return <StyledSteps {...{ items, currentItemIndex }} />;
};

export default Timeline;
