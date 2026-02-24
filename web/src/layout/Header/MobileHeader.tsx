import React, { useContext, useMemo, useRef } from "react";
import { useClickAway, useToggle } from "react-use";

import HamburgerIcon from "svgs/header/hamburger.svg";

import LightButton from "components/LightButton";
import NavBar from "./navbar";
import Logo from "./Logo";

const OpenContext = React.createContext({
  isOpen: false,
  toggleIsOpen: () => {
    // Placeholder
  },
});

export function useOpenContext() {
  return useContext(OpenContext);
}

const MobileHeader = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  const containerRef = useRef(null);

  // useClickAway defaults to ["mousedown", "touchstart"]. 
  // We use ["click"] so that when the user taps the Policies dropdown option, the option's handler runs and navigates before the menu closes. 
  // Otherwise, touchstart would fire first, the menu would close, and a second tap would be required to actually select the Policy dropdownoption.
  useClickAway(containerRef, () => toggleIsOpen(false), ["click"]);
  const memoizedContext = useMemo(() => ({ isOpen, toggleIsOpen }), [isOpen, toggleIsOpen]);
  return (
    <div ref={containerRef} className="flex items-center justify-between w-full h-16 lg:hidden">
      <OpenContext.Provider value={memoizedContext}>
        <Logo />
        <NavBar />
        <LightButton className="p-0 [&_.button-svg]:mr-0" text="" Icon={HamburgerIcon} onPress={toggleIsOpen} />
      </OpenContext.Provider>
    </div>
  );
};
export default MobileHeader;
