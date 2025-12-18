import { useMemo } from "react";

import { useWindowSize } from "react-use";
import { LG_BREAKPOINT } from "src/styles/breakpoints";

const useIsDesktop = () => {
  const { width } = useWindowSize();
  return useMemo(() => width > LG_BREAKPOINT, [width]);
};

export default useIsDesktop;
