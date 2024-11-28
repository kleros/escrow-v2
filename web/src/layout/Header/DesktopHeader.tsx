import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useToggle } from "react-use";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useLockOverlayScroll } from "hooks/useLockOverlayScroll";
import { DEFAULT_CHAIN } from "consts/chains";
import KlerosSolutionsIcon from "svgs/menu-icons/kleros-solutions.svg";
import EscrowLogo from "svgs/header/escrow.svg";
import ConnectWallet from "components/ConnectWallet";
import LightButton from "components/LightButton";
import DappList from "./navbar/DappList";
import Explore from "./navbar/Explore";
import Menu from "./navbar/Menu";
import Help from "./navbar/Menu/Help";
import Settings from "./navbar/Menu/Settings";
import { PopupContainer } from ".";
const Container = styled.div`
  display: none;
  position: absolute;

  ${landscapeStyle(
    () => css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative;
    `
  )};
`;

const LeftSide = styled.div`
  display: flex;
`;

const MiddleSide = styled.div`
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.white} !important;
`;

const RightSide = styled.div`
  display: flex;
  gap: calc(8px + (16 - 8) * ((100vw - 300px) / (1024 - 300)));
  margin-left: 8px;
  canvas {
    width: 20px;
  }
`;

const LightButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 16px;
  margin-left: calc(4px + (8 - 4) * ((100vw - 375px) / (1250 - 375)));
  margin-right: calc(12px + (16 - 12) * ((100vw - 375px) / (1250 - 375)));
`;

const StyledLink = styled(Link)`
  min-height: 48px;
`;

const StyledKlerosSolutionsIcon = styled(KlerosSolutionsIcon)`
  fill: ${({ theme }) => theme.white} !important;
`;

const ConnectWalletContainer = styled.div<{ isConnected: boolean; isDefaultChain: boolean }>`
  label {
    color: ${({ theme }) => theme.white};
  }

  ${({ isConnected, isDefaultChain }) =>
    isConnected &&
    isDefaultChain &&
    css`
      cursor: pointer;
      & > * {
        pointer-events: none;
      }
    `}
`;

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
      <Container>
        <LeftSide>
          <LightButtonContainer>
            <LightButton text="" onClick={toggleIsDappListOpen} Icon={StyledKlerosSolutionsIcon} />
          </LightButtonContainer>
          <StyledLink to={"/"}>
            <EscrowLogo />
          </StyledLink>
        </LeftSide>

        <MiddleSide>
          <Explore />
        </MiddleSide>

        <RightSide>
          <ConnectWalletContainer
            {...{ isConnected, isDefaultChain }}
            onClick={isConnected && isDefaultChain ? toggleIsSettingsOpen : undefined}
          >
            <ConnectWallet />
          </ConnectWalletContainer>
          <Menu {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />
        </RightSide>
      </Container>
      {(isDappListOpen || isHelpOpen || isSettingsOpen) && (
        <PopupContainer>
          {isDappListOpen && <DappList {...{ toggleIsDappListOpen, isDappListOpen }} />}
          {isHelpOpen && <Help {...{ toggleIsHelpOpen, isHelpOpen }} />}
          {isSettingsOpen && <Settings {...{ toggleIsSettingsOpen, isSettingsOpen, initialTab }} />}
        </PopupContainer>
      )}
    </>
  );
};

export default DesktopHeader;
