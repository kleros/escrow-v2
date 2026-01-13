import React, { useCallback, useEffect, useState } from "react";

import { useToggle } from "react-use";
import { useAccount } from "wagmi";

import { useLockOverlayScroll } from "hooks/useLockOverlayScroll";
import { DEFAULT_CHAIN } from "consts/chains";

import KlerosSolutionsIcon from "svgs/menu-icons/kleros-solutions.svg";

import ConnectWallet from "components/ConnectWallet";
import LightButton from "components/LightButton";
import OverlayPortal from "components/OverlayPortal";
import { Overlay } from "components/Overlay";

import DappList from "./navbar/DappList";
import Explore from "./navbar/Explore";
import Menu from "./navbar/Menu";
import Help from "./navbar/Menu/Help";
import Settings from "./navbar/Menu/Settings";
import Logo from "./Logo";

const DesktopHeader = () => {
  const [isDappListOpen, toggleIsDappListOpen] = useToggle(false);
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);
  const [isSettingsOpen, toggleIsSettingsOpen] = useToggle(false);
  const [initialTab, setInitialTab] = useState<number>(0);

  const { isConnected, chain } = useAccount();

  const isDefaultChain = chain?.id === DEFAULT_CHAIN;

  const initializeFragmentURL = useCallback(() => {
    const hasNotificationsPath = location.hash.includes("#notifications");
    toggleIsSettingsOpen(hasNotificationsPath);
    setInitialTab(hasNotificationsPath ? 1 : 0);
  }, [toggleIsSettingsOpen, location.hash]);

  useEffect(initializeFragmentURL, [initializeFragmentURL]);
  useLockOverlayScroll(isDappListOpen || isHelpOpen || isSettingsOpen);

  return (
    <>
      <div className="hidden h-16 lg:flex lg:items-center lg:justify-between lg:w-full lg:relative">
        <div className="flex gap-2">
          <div className="flex items-center">
            <LightButton text="" onPress={toggleIsDappListOpen} Icon={KlerosSolutionsIcon} />
          </div>
          <Logo />
        </div>

        <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Explore />
        </div>

        <div className="flex gap-fluid-4-8 ml-2 [&_canvas]:w-5">
          <div
            className="[&_label]:cursor-pointer [&_label]:text-white/80"
            onClick={isConnected && isDefaultChain ? toggleIsSettingsOpen : undefined}
          >
            <ConnectWallet />
          </div>
          <Menu {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />
        </div>
      </div>
      {(isDappListOpen || isHelpOpen || isSettingsOpen) && (
        <OverlayPortal>
          <Overlay>
            {isDappListOpen && <DappList {...{ toggleIsDappListOpen, isDappListOpen }} />}
            {isHelpOpen && <Help {...{ toggleIsHelpOpen, isHelpOpen }} />}
            {isSettingsOpen && <Settings {...{ toggleIsSettingsOpen, isSettingsOpen, initialTab }} />}
          </Overlay>
        </OverlayPortal>
      )}
    </>
  );
};

export default DesktopHeader;
