import React from "react";
import styled from "styled-components";
import ArbIcon from "tsx:svgs/icons/tokens/arb.svg";
import DaiIcon from "tsx:svgs/icons/tokens/dai.svg";
import EthIcon from "tsx:svgs/icons/tokens/eth.svg";
import GnoIcon from "tsx:svgs/icons/tokens/gno.svg";
import MaticIcon from "tsx:svgs/icons/tokens/matic.svg";
import OpIcon from "tsx:svgs/icons/tokens/op.svg";
import PnkIcon from "tsx:svgs/icons/tokens/pnk.svg";
import UsdcIcon from "tsx:svgs/icons/tokens/usdc.svg";
import UsdtIcon from "tsx:svgs/icons/tokens/usdt.svg";
import WethIcon from "tsx:svgs/icons/tokens/weth.svg";
import UnknownTokenIcon from "tsx:svgs/icons/tokens/unknown.svg";

export const TokenLogoImg = styled.img`
  width: 24px;
  height: 24px;
`;

export const StyledUnknownTokenIcon = styled(UnknownTokenIcon)`
  width: 24px;
  height: 24px;
  circle {
    fill: ${({ theme }) => theme.stroke};
  }
`;

const tokenIcons = {
  arb: ArbIcon,
  dai: DaiIcon,
  gno: GnoIcon,
  matic: MaticIcon,
  op: OpIcon,
  pnk: PnkIcon,
  usdc: UsdcIcon,
  usdt: UsdtIcon,
  weth: WethIcon,
  eth: EthIcon,
};

const getTokenLogo = (tokenSymbol) => {
  const symbol = tokenSymbol.toLowerCase();
  return tokenIcons[symbol] || null;
};

const TokenIcon = ({ symbol, logo }) => {
  const TokenLogoComponent = getTokenLogo(symbol);
  if (TokenLogoComponent) {
    return <TokenLogoComponent width={24} height={24} />;
  } else if (logo) {
    return <TokenLogoImg src={logo} alt={`${symbol} logo`} />;
  } else {
    return <StyledUnknownTokenIcon width={24} height={24} />;
  }
};

export default TokenIcon;
