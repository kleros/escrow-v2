import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@kleros/ui-components-library";

import Arrow from "svgs/icons/arrow-left.svg";
import PaperClip from "svgs/icons/paperclip.svg";
import clsx from "clsx";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full justify-between items-center mb-10">
      <div className="flex items-center gap-2">
        <PaperClip className="size-fluid-16-24 fill-klerosUIComponentsPrimaryPurple" />
        <h1 className="m-0 text-(length:--spacing-fluid-16-24)">Attachment File</h1>{" "}
      </div>
      <Button
        className={clsx(
          "bg-transparent p-0",
          "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:font-normal",
          "[&_.button-svg_path]:fill-klerosUIComponentsPrimaryBlue",
          "focus:bg-transparent hover:bg-transparent",
          "focus:[&_.button-svg_path]:fill-klerosUIComponentsSecondaryBlue hover:[&_.button-svg_path]:fill-klerosUIComponentsSecondaryBlue",
          "focus:[&_.button-text]:text-klerosUIComponentsSecondaryBlue hover:[&_.button-text]:text-klerosUIComponentsSecondaryBlue"
        )}
        text="Return"
        Icon={Arrow}
        onPress={() => navigate(-1)}
      />
    </div>
  );
};

export default Header;
