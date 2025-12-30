import React from "react";
import Arrow from "svgs/icons/arrow-down.svg";
import { cn } from "~src/utils";

interface ISimpleToggleButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  label: string;
}

const SimpleToggleButton: React.FC<ISimpleToggleButton> = ({ isOpen, label, onClick }) => (
  <button
    className={cn(
      "flex items-center justify-center p-0",
      "cursor-pointer bg-transparent border-none outline-none",
      "focus-visible:box-shadow-[0_0_0_2px_var(--klerosUIComponentsPrimaryBlue)]",
      "hover:[&_label]:text-klerosUIComponentsSecondaryBlue hover:[&_svg]:fill-klerosUIComponentsSecondaryBlue"
    )}
    {...{ onClick }}
  >
    <label className="text-xs text-klerosUIComponentsPrimaryBlue cursor-pointer transition-colors ease-in-out duration-200">
      {label}
    </label>
    <Arrow
      className={cn(
        "w-2.5 h-2.5 ml-1.5 transition-transform ease-in-out duration-200 fill-klerosUIComponentsPrimaryBlue",
        isOpen ? "rotate-180" : "rotate-0"
      )}
    />
  </button>
);

export default SimpleToggleButton;
