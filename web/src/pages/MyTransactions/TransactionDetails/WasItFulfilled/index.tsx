import React from "react";
import { Card } from "@kleros/ui-components-library";
import Buttons from "./Buttons";
import clsx from "clsx";

const WasItFulfilled: React.FC = () => {
  return (
    <Card
      className={clsx(
        "flex flex-col gap-6 self-center items-center",
        "w-full h-auto px-10 pt-8 pb-1",
        "bg-klerosUIComponentsMediumBlue border border-klerosUIComponentsPrimaryBlue"
      )}
    >
      <p className="m-0 text-klerosUIComponentsPrimaryBlue font-semibold">Was the agreement fulfilled?</p>
      <Buttons />
    </Card>
  );
};
export default WasItFulfilled;
