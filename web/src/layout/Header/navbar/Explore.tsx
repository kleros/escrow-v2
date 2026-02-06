import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useOpenContext } from "../MobileHeader";
import { cn } from "src/utils";

const links = [
  { to: "/new-transaction", text: "New Transaction" },
  { to: "/transactions/display/1/desc/all", text: "My Transactions" },
];

interface IExplore {
  isMobileNavbar?: boolean;
}

const Explore: React.FC<IExplore> = ({ isMobileNavbar }) => {
  const location = useLocation();
  const { toggleIsOpen } = useOpenContext();
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.split("/")[1] === to.split("/")[1];

  return (
    <div className="flex flex-col lg:flex-row">
      <h1 className="block mb-2 lg:hidden">Explore</h1>
      {links.map(({ to, text }) => (
        <Link
          key={text}
          className={cn(
            "flex items-center p-2 pl-0 rounded-[7px] lg:py-4 lg:px-2",
            "text-base leading-tight",
            isActive(to) ? "text-klerosUIComponentsPrimaryText lg:text-white" : "text-primary-text-73 lg:text-white-73",
            isMobileNavbar ? "hover:text-klerosUIComponentsPrimaryText" : "hover:text-white",
            isMobileNavbar && isActive(to) ? "font-semibold" : "font-normal"
          )}
          onClick={toggleIsOpen}
          {...{ to }}
        >
          {text}
        </Link>
      ))}
    </div>
  );
};

export default Explore;
