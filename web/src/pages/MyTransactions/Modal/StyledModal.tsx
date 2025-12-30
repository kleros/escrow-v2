import React, { forwardRef } from "react";
import { cn } from "src/utils";

const StyledModal = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed flex flex-col items-center overflow-y-auto z-10",
        "custom-scrollbar bg-klerosUIComponentsWhiteBackground max-h-[80vh] w-[86vw] max-w-[600px]",
        "top-[10vh] left-1/2 transform -translate-x-1/2",
        "border rounded-[3px] border-klerosUIComponentsStroke",
        "p-8 pl-9 shadow-custom",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
export default StyledModal;
