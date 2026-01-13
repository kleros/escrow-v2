import React from "react";
import { Steps } from "@kleros/ui-components-library";
import { useLocation } from "react-router-dom";

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

  return <Steps className="hidden lg:absolute lg:flex lg:left-[4%] lg:h-[200px]" {...{ items, currentItemIndex }} />;
};

export default Timeline;
