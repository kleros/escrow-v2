import React, { useRef } from "react";

import { useClickAway } from "react-use";

import Curate from "svgs/icons/curate-image.png";
import Resolver from "svgs/icons/dispute-resolver.svg";
import Escrow from "svgs/icons/escrow.svg";
import Governor from "svgs/icons/governor.svg";
import Court from "svgs/icons/kleros.svg";
import POH from "svgs/icons/poh-image.png";
import Vea from "svgs/icons/vea.svg";

import Product from "./Product";
import clsx from "clsx";

const ITEMS = [
  {
    text: "Court V2",
    Icon: Court,
    url: "https://v2.kleros.builders/",
  },
  {
    text: "Curate V2",
    Icon: Curate,
    url: "https://curate-v2.netlify.app/",
  },
  {
    text: "Resolver V2",
    Icon: Resolver,
    url: "https://v2.kleros.builders/#/resolver",
  },
  {
    text: "Escrow V2",
    Icon: Escrow,
    url: "https://escrow-v2.kleros.builders/",
  },
  {
    text: "Court V1",
    Icon: Court,
    url: "https://court.kleros.io/",
  },
  {
    text: "Curate V1",
    Icon: Curate,
    url: "https://curate.kleros.io",
  },
  {
    text: "Resolver V1",
    Icon: Resolver,
    url: "https://resolve.kleros.io",
  },
  {
    text: "Escrow V1",
    Icon: Escrow,
    url: "https://escrow.kleros.io",
  },
  {
    text: "Vea",
    Icon: Vea,
    url: "https://veascan.io",
  },
  {
    text: "Kleros Scout",
    Icon: Curate,
    url: "https://klerosscout.eth.limo",
  },
  {
    text: "POH V2",
    Icon: POH,
    url: "https://v2.proofofhumanity.id",
  },
  {
    text: "Governor",
    Icon: Governor,
    url: "https://governor.kleros.io",
  },
];

interface IDappList {
  toggleIsDappListOpen: () => void;
}

const DappList: React.FC<IDappList> = ({ toggleIsDappListOpen }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleIsDappListOpen());

  return (
    <div
      ref={containerRef}
      className={clsx(
        "flex flex-col items-center absolute max-h-[340px] w-[86vw] max-w-[480px]",
        "top-[5%] left-1/2 transform -translate-x-1/2 z-1",
        "border border-klerosUIComponentsStroke rounded-[3px]",
        "bg-klerosUIComponentsWhiteBackground shadow-custom",
        "[&_svg]:visible",
        "lg:w-fluid-300-480 lg:mt-16 lg:top-0 lg:left-0 lg:right-auto lg:transform-none lg:translate-x-0 lg:max-h-[80vh]"
      )}
    >
      <h1 className="pt-6 mb-4">Kleros Solutions</h1>
      <div
        className={clsx(
          "grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))]",
          "overflow-y-auto gap-y-2 gap-x-0.5 justify-items-center w-fluid-300-480",
          "p-1 pb-4 px-fluid-8-24"
        )}
      >
        {ITEMS.map((item) => {
          return <Product {...item} key={item.text} />;
        })}
      </div>
    </div>
  );
};
export default DappList;
