import clsx from "clsx";

export const baseModalStyle = clsx(
  "fixed flex flex-col items-center overflow-y-auto z-10",
  "custom-scrollbar h-fit max-h-[80vh] w-[86vw] max-w-[600px]",
  "top-[10vh] left-1/2 transform -translate-x-1/2",
  "border border-klerosUIComponentsStroke",
  "p-8 pl-9 shadow-custom"
);

export const baseModalOverlayStyle = "w-screen h-screen";
