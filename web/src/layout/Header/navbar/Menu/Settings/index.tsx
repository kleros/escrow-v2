import React, { useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useClickAway } from "react-use";
import { Tabs } from "@kleros/ui-components-library";

import General from "./General";
import NotificationSettings from "./Notifications";
import { ISettings } from "../../index";
import clsx from "clsx";

const TABS = [
  {
    id: 0,
    value: 0,
    text: "General",
    content: <General />,
  },
  {
    id: 1,
    value: 1,
    text: "Notifications",
    content: null,
  },
];

const Settings: React.FC<ISettings> = ({ toggleIsSettingsOpen }) => {
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  useClickAway(containerRef, () => {
    toggleIsSettingsOpen();
    if (location.hash.includes("#notifications")) navigate("#", { replace: true });
  });

  return (
    <div
      ref={containerRef}
      className={clsx(
        "flex flex-col absolute max-h-[80vh] overflow-y-auto",
        "top-[5%] left-1/2 transform -translate-x-1/2 z-1 rounded-[3px]",
        "bg-klerosUIComponentsWhiteBackground border border-solid border-klerosUIComponentsStroke",
        "lg:mt-16 lg:top-0 lg:right-0 lg:left-auto lg:transform-none lg:translate-x-0"
      )}
    >
      <div className="flex justify-center text-2xl mt-6 text-klerosUIComponentsPrimaryText">Settings</div>
      <Tabs
        className={clsx(
          "py-0 max-w-[660px] w-[86vw] self-center lg:w-fluid-300-424-300",
          "[&>div:first-child]:px-fluid-8-32-300"
        )}
        items={[TABS[0], { ...TABS[1], content: <NotificationSettings {...{ toggleIsSettingsOpen }} /> }]}
      />
    </div>
  );
};

export default Settings;
