import React from "react";
import styled from "styled-components";
import Balance from "./Balance";
import TokenIcon from "./TokenIcon";

const Container = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  justify-content: space-between;
  background: ${({ theme, selected }) => (selected ? theme.mediumBlue : "transparent")};
  border-left: ${({ theme, selected }) => (selected ? `3px solid ${theme.primaryBlue}` : "none")};
  padding-left: ${({ selected }) => (selected ? "13px" : "16px")};

  &:hover {
    background: ${({ theme }) => theme.lightBlue};
  }
`;

const LogoAndLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const TokenLabel = styled.span`
  color: ${({ theme }) => theme.primaryText};
`;

const TokenItem = ({ token, selected, onSelect }) => {
  return (
    <Container selected={selected} onClick={() => onSelect(token)}>
      <LogoAndLabel>
        <TokenIcon symbol={token.symbol} logo={token.logo} />
        <TokenLabel>{token.symbol}</TokenLabel>
      </LogoAndLabel>
      <Balance {...{ token }} />
    </Container>
  );
};

export default TokenItem;
