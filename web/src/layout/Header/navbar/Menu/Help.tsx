import React, { useRef } from "react";

import { useClickAway } from "react-use";

import Guide from "svgs/icons/book.svg";
import Bug from "svgs/icons/bug.svg";
import ETH from "svgs/icons/eth.svg";
import Faq from "svgs/menu-icons/help.svg";
import Telegram from "svgs/socialmedia/telegram.svg";

import Debug from "../Debug";
import { IHelp } from "../index";
import clsx from "clsx";

const ITEMS = [
  {
    text: "Get Help",
    Icon: Telegram,
    url: "https://t.me/kleros",
  },
  {
    text: "Report a Bug",
    Icon: Bug,
    url: "https://github.com/kleros/escrow-v2/issues",
  },
  {
    text: "DApp Guide",
    Icon: Guide,
    url: "https://docs.kleros.io/products/escrow",
  },
  {
    text: "Crypto Beginner's Guide",
    Icon: ETH,
    url: "https://ethereum.org/en/wallets/",
  },
  {
    text: "FAQ",
    Icon: Faq,
    url: "https://docs.kleros.io/kleros-faq",
  },
];

const Help: React.FC<IHelp> = ({ toggleIsHelpOpen }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleIsHelpOpen());

  return (
    <>
      <div
        ref={containerRef}
        className={clsx(
          "flex flex-col absolute max-h-[80vh] w-[86vw] max-w-[444px]",
          "overflow-y-auto z-1 p-3 pb-6",
          "top-[5%] left-1/2 transform -translate-x-1/2",
          "border border-klerosUIComponentsStroke rounded-base",
          "bg-klerosUIComponentsWhiteBackground shadow-custom",
          "lg:mt-16 lg:top-0 lg:right-0 lg:left-auto lg:transform-none lg:translate-x-0 lg:max-w-[260px]"
        )}
      >
        {ITEMS.map((item, index) => (
          <a
            href={item.url}
            key={item.text}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "flex gap-2 py-3 px-2 cursor-pointer transition-transform duration-200",
              "hover:scale-[1.02] group"
            )}
          >
            <item.Icon className="inline-block w-4 h-4 fill-klerosUIComponentsSecondaryPurple" />
            <small
              className={clsx(
                "text-base leading-18px text-klerosUIComponentsPrimaryText",
                "transition-colors duration-100",
                "group-hover:text-klerosUIComponentsSecondaryPurple"
              )}
            >
              {item.text}
            </small>
          </a>
        ))}
        <Debug />
      </div>
    </>
  );
};
export default Help;
