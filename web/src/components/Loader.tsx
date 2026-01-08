import React, { CSSProperties } from "react";

import KlerosIcon from "svgs/icons/kleros.svg";
import { cn } from "src/utils";

type Width = CSSProperties["width"];
type Height = CSSProperties["height"];

interface ILoader {
  width?: Width;
  height?: Height;
  className?: string;
}

const Loader: React.FC<ILoader> = ({ width, height, className }) => {
  return (
    <div className={cn(!width && "w-full", !height && "h-full", className)} style={{ width, height }}>
      <KlerosIcon className="fill-klerosUIComponentsStroke animate-breathing" />
    </div>
  );
};

export default Loader;
