import React from "react";
import styled from "styled-components";

const Container = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  background: ${({ theme, selected }) => (selected ? theme.mediumBlue : "transparent")};
  border-left: ${({ theme, selected }) => (selected ? `3px solid ${theme.primaryBlue}` : "none")};
  padding-left: ${({ selected }) => (selected ? "13px" : "16px")};

  &:hover {
    background: ${({ theme }) => theme.lightBlue};
  }
`;

const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
`;

const TokenLabel = styled.span`
  color: ${({ theme }) => theme.primaryText};
`;

const TokenItem = ({ token, selected, onSelect }) => (
  <Container selected={selected} onClick={() => onSelect(token)}>
    <TokenLogo src={token.logo} alt={`${token.symbol} logo`} />
    <TokenLabel>{token.symbol}</TokenLabel>
  </Container>
);

export default TokenItem;
