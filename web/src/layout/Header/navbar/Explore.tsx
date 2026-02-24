import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useOpenContext } from "../MobileHeader";
import { cn } from "src/utils";
import { DropdownSelect } from "@kleros/ui-components-library";
import { getIpfsUrl } from "~src/utils/getIpfsUrl";
import PolicyIcon from "svgs/icons/policy.svg";
import DocIcon from "svgs/icons/doc.svg";

const links = [
  { to: "/new-transaction", text: "New Transaction" },
  { to: "/transactions/display/1/desc/all", text: "My Transactions" },
];

const policies = [
  {
    id: "general",
    text: "General Policy",
    icon: <PolicyIcon width={16} height={16} className="fill-klerosUIComponentsPrimaryBlue mr-2" />,
    itemValue: "ipfs/QmU2GuwcSs8tFp8gWf5hcXVbcJKRqwoecNnERz9XjKr18d"
  },
  {
    id: "good_practices",
    text: "Good Practices",
    icon: <DocIcon width={16} height={16} className="fill-klerosUIComponentsPrimaryBlue mr-2" />,
    itemValue: "ipfs/QmcCyR68RmwWfdVKinY8Fmiy73a6xEzGqYDcvAh9EFUnLF"
  },
]

interface IExplore {
  isMobileNavbar?: boolean;
}

const Explore: React.FC<IExplore> = ({ isMobileNavbar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleIsOpen } = useOpenContext();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.split("/")[1] === to.split("/")[1];

  const urlParam = new URLSearchParams(location.search).get("url");
  const isViewingPolicies =
    !!urlParam && policies.some((p) => getIpfsUrl(p.itemValue) === urlParam);

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

      <DropdownSelect
        className={cn(
          "p-2 pl-0 lg:py-4 lg:px-2",
          "[&_button]:focus:shadow-none [&_button]:p-0",
          "[&_svg]:fill-primary-text-73 lg:[&_svg]:fill-white-73",
          "[&_span]:text-base [&_span]:leading-tight",
          isMobileNavbar ? "[&_span]:hover:text-klerosUIComponentsPrimaryText" : "[&_span]:hover:text-white",
          isViewingPolicies ? "[&_span]:text-klerosUIComponentsPrimaryText lg:[&_span]:text-white" : "[&_span]:text-primary-text-73 lg:[&_span]:text-white-73",
          isMobileNavbar && isViewingPolicies ? "[&_span]:font-semibold" : "[&_span]:font-normal",
        )}
        simpleButton
        placeholder="Policies" // Acts as the dropdown label
        selectedKey={null} // Trick to not change the dropdown label when an item is clicked
        items={policies}
        callback={(item) => {
          navigate(`/attachment/?url=${getIpfsUrl(item.itemValue)}`);
          if (isMobileNavbar) toggleIsOpen();
        }}
      />
    </div>
  );
};

export default Explore;
