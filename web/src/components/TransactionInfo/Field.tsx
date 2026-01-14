import React from "react";
import { Link } from "react-router-dom";
import { cn } from "src/utils";

interface IField {
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  name: string;
  value: React.ReactNode | string;
  link?: string;
  displayAsList?: boolean;
  isPreview?: boolean;
}

const Field: React.FC<IField> = ({ icon: Icon, name, value, link, displayAsList, isPreview }) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start wrap-break-word w-full",
        displayAsList && "lg:w-auto",
        isPreview && "w-auto gap-2"
      )}
    >
      <>
        <Icon className={cn("fill-klerosUIComponentsSecondaryPurple mr-2 w-3.5", isPreview && "mr-0")} />
        <label
          className={cn(
            displayAsList && [name === "Buyer" || name === "Seller" ? "flex mr-2" : "hidden"],
            isPreview && "flex mr-0"
          )}
        >
          {name}:
        </label>
      </>
      {link ? (
        <Link className="grow text-end text-klerosUIComponentsPrimaryBlue hover:cursor-pointer" to={link}>
          {value}
        </Link>
      ) : (
        <label
          className={cn("grow text-end text-klerosUIComponentsPrimaryText", isPreview && "font-semibold text-start")}
        >
          {value}
        </label>
      )}
    </div>
  );
};

export default Field;
