import React from "react";
import { Button } from "@kleros/ui-components-library";
import { cn } from "src/utils";

interface ILightButton {
  text: string;
  Icon?: React.FC<React.SVGAttributes<SVGElement>>;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  isMobileNavbar?: boolean;
}

const LightButton: React.FC<ILightButton> = ({ text, Icon, onPress, disabled, className, isMobileNavbar }) => (
  <Button
    variant="primary"
    small
    className={cn(
      "p-2 rounded-[7px]!",
      "bg-transparent hover:bg-white-low-opacity-strong transition duration-100",
      "[&_.button-text]:text-klerosUIComponentsPrimaryText [&_.button-text]:font-normal",
      "lg:[&_.button-svg]:mr-0",
      isMobileNavbar
        ? "[&_.button-svg]:fill-klerosUIComponentsSecondaryText hover:[&_.button-svg]:fill-klerosUIComponentsPrimaryText"
        : "[&_.button-svg]:fill-white/75 hover:[&_.button-svg]:fill-white",
      className
    )}
    {...{ text, Icon, disabled, onPress }}
  />
);

export default LightButton;
