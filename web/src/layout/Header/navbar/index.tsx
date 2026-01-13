import React from "react";

import { useToggle } from "react-use";
import { useAccount } from "wagmi";

import KlerosSolutionsIcon from "svgs/menu-icons/kleros-solutions.svg";

import { useLockOverlayScroll } from "hooks/useLockOverlayScroll";

import ConnectWallet from "components/ConnectWallet";
import LightButton from "components/LightButton";
import OverlayPortal from "components/OverlayPortal";
import { Overlay } from "components/Overlay";

import { useOpenContext } from "../MobileHeader";
import DappList from "./DappList";
import Explore from "./Explore";
import Menu from "./Menu";
import Help from "./Menu/Help";
import Settings from "./Menu/Settings";
import { DisconnectWalletButton } from "./Menu/Settings/General";
import { cn } from "src/utils";

export interface ISettings {
  toggleIsSettingsOpen: () => void;
  initialTab?: number;
}

export interface IHelp {
  toggleIsHelpOpen: () => void;
}

export interface IDappList {
  toggleIsDappListOpen: () => void;
}

const NavBar: React.FC = () => {
  const { isConnected } = useAccount();
  const [isDappListOpen, toggleIsDappListOpen] = useToggle(false);
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);
  const [isSettingsOpen, toggleIsSettingsOpen] = useToggle(false);
  const { isOpen } = useOpenContext();
  useLockOverlayScroll(isOpen);

  return (
    <>
      <div className={cn("absolute top-full left-0 w-screen h-screen z-1", isOpen ? "visible" : "hidden")}>
        <Overlay className="top-[unset]">
          <div
            className={cn(
              "absolute top-0 left-0 right-0 max-h-[calc(100vh-160px)] p-6 overflow-y-auto z-10",
              "bg-klerosUIComponentsWhiteBackground shadow-default origin-top",
              "transition-[transform,visibility] duration-[klerosUIComponentsTransitionSpeed] ease-in-out",
              "[&_hr]:my-6",
              isOpen ? "scale-y-100 visible" : "scale-y-0 invisible"
            )}
          >
            <LightButton
              isMobileNavbar={true}
              text="Kleros Solutions"
              onPress={toggleIsDappListOpen}
              Icon={KlerosSolutionsIcon}
            />
            <hr />
            <Explore isMobileNavbar={true} />
            <hr />
            <div className="flex gap-4 justify-between flex-wrap">
              <ConnectWallet />
              {isConnected && (
                <div className="flex items-center">
                  <DisconnectWalletButton />
                </div>
              )}
            </div>
            <hr />
            <Menu {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} isMobileNavbar={true} />
            <br />
          </div>
        </Overlay>
      </div>
      {(isDappListOpen || isHelpOpen || isSettingsOpen) && (
        <OverlayPortal>
          <Overlay>
            {isDappListOpen && <DappList {...{ toggleIsDappListOpen }} />}
            {isHelpOpen && <Help {...{ toggleIsHelpOpen }} />}
            {isSettingsOpen && <Settings {...{ toggleIsSettingsOpen }} />}
          </Overlay>
        </OverlayPortal>
      )}
    </>
  );
};

export default NavBar;
