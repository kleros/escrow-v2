import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";

import { useClickAway } from "react-use";

import Guide from "svgs/icons/book.svg";
import Bug from "svgs/icons/bug.svg";
import ETH from "svgs/icons/eth.svg";
import Faq from "svgs/menu-icons/help.svg";
import Telegram from "svgs/socialmedia/telegram.svg";

import Debug from "../Debug";
import { IHelp } from "../index";
import { StyledSmall } from "components/StyledTags";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  max-height: 80vh;
  overflow-y: auto;
  width: 86vw;
  max-width: 444px;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  padding: 12px 12px 24px 12px;
  border: 1px solid ${({ theme }) => theme.stroke};
  background-color: ${({ theme }) => theme.whiteBackground};
  border-radius: 3px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.06);

  ${landscapeStyle(
    () => css`
      margin-top: 64px;
      width: 260px;
      top: 0;
      right: 0;
      left: auto;
      transform: none;
    `
  )}
`;

const ListItem = styled.a`
  display: flex;
  gap: 8px;
  padding: 12px 8px;
  cursor: pointer;
  transition: transform 0.2s;

  small {
    font-size: 16px;
    font-weight: 400;
  }

  :hover {
    transform: scale(1.02);
  }

  :hover small {
    transition: color 0.1s;
    color: ${({ theme }) => theme.secondaryPurple};
  }
`;

const Icon = styled.svg`
  display: inline-block;
  width: 16px;
  height: 16px;
  fill: ${({ theme }) => theme.secondaryPurple};
`;

const ITEMS = [
  {
    text: "Get Help",
    Icon: Telegram,
    url: "https://t.me/kleros",
  },
  {
    text: "Report a Bug",
    Icon: Bug,
    url: "https://github.com/kleros/escrow-v2/issues",
  },
  {
    text: "DApp Guide",
    Icon: Guide,
    url: "https://docs.kleros.io/products/escrow",
  },
  {
    text: "Crypto Beginner's Guide",
    Icon: ETH,
    url: "https://ethereum.org/en/wallets/",
  },
  {
    text: "FAQ",
    Icon: Faq,
    url: "https://docs.kleros.io/kleros-faq",
  },
];

const Help: React.FC<IHelp> = ({ toggleIsHelpOpen }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleIsHelpOpen());

  return (
    <>
      <Container ref={containerRef}>
        {ITEMS.map((item, index) => (
          <ListItem href={item.url} key={item.text} target="_blank">
            <Icon as={item.Icon} />
            <StyledSmall>{item.text}</StyledSmall>
          </ListItem>
        ))}
        <Debug />
      </Container>
    </>
  );
};
export default Help;
