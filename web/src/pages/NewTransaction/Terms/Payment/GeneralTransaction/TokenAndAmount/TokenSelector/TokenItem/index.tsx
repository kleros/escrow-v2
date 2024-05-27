import React from "react";
import styled from "styled-components";
import Balance from "./Balance";

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

const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
`;

const TokenLabel = styled.span`
  color: ${({ theme }) => theme.primaryText};
`;

const TokenItem = ({ token, selected, onSelect }) => {
  return (
    <Container selected={selected} onClick={() => onSelect(token)}>
      <LogoAndLabel>
        <TokenLogo src={token.logo} alt={`${token.symbol} logo`} />
        <TokenLabel>{token.symbol}</TokenLabel>
      </LogoAndLabel>
      <Balance {...{ token }} />
    </Container>
  );
};

export default TokenItem;
