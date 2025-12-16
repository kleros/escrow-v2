import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";

interface IProduct {
  text: string;
  url: string;
  Icon: React.FC<React.SVGAttributes<SVGElement>> | string;
}

const Product: React.FC<IProduct> = ({ text, url, Icon }) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "flex flex-col items-center pt-4 pb-7 px-2 max-w-[100px] w-fluid-100-130 rounded-[3px] gap-2",
        "cursor-pointer bg-klerosUIComponentsLightBackground hover:bg-light-grey dark:hover:bg-klerosUIComponentsLightGrey",
        "hover:transition-[transform_0.15s,background-color_0.3s] hover:scale-[1.02]"
      )}
    >
      {typeof Icon === "string" ? (
        <>
          {!isImgLoaded ? <Skeleton width={48} height={46} circle /> : null}
          <img
            className={`w-12 h-12 ${isImgLoaded ? "block" : "hidden"}`}
            alt={Icon}
            src={Icon}
            onLoad={() => setIsImgLoaded(true)}
          />
        </>
      ) : (
        <Icon className="w-12 h-12" />
      )}
      <small className="flex text-center text-sm text-klerosUIComponentsPrimaryText leading-snug">{text}</small>
    </a>
  );
};

export default Product;
