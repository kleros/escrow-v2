import React from "react";
import { cn } from "src/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export const Overlay: React.FC<Props> = ({ children, className }) => (
  <div className={cn("fixed top-0 left-0 w-screen h-screen bg-black-low-opacity z-30", className)}>{children}</div>
);
