import React from "react";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import { StatusBanner } from "subgraph-status";
import { getGraphqlUrl } from "utils/getGraphqlUrl";
import clsx from "clsx";

const Header: React.FC = () => {
  const SHOW_STATUS_BANNER = import.meta.env.REACT_APP_SHOW_STATUS_BANNER !== "false";

  return (
    <div
      className={clsx(
        "flex flex-wrap sticky z-10 top-0 w-full",
        "bg-klerosUIComponentsPrimaryPurple dark:bg-light-blue-65 backdrop-blur-none dark:backdrop-blur-md"
      )}
    >
      {SHOW_STATUS_BANNER && (
        <StatusBanner
          className="sticky! [&_.status-text_h2]:m-0 [&_.status-text_h2]:leading-6"
          autoHide
          watcherOptions={{ threshold: 5000, interval: 60_000 }} // 5000 blocks threshold, 60 sec interval check
          theme={{
            colors: {
              main: "var(--klerosUIComponentsWhiteBackground)",
              primary: "var(--klerosUIComponentsPrimaryText)",
              secondary: "var(--klerosUIComponentsSecondaryText)",
            },
          }}
          subgraphs={[{ name: "Kleros Escrow", url: getGraphqlUrl() }]}
        />
      )}
      <div className="w-full px-6">
        <DesktopHeader />
        <MobileHeader />
      </div>
    </div>
  );
};

export default Header;
