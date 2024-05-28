import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 3px;
  width: 186px;
  height: 45px;
  position: relative;
  padding: 9.5px 14px;
  cursor: pointer;
  background: ${({ theme }) => theme.whiteBackground};
  color: ${({ theme }) => theme.primaryText};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DropdownArrow = styled.span`
  border: solid ${({ theme }) => theme.stroke};
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  margin-left: 8px;
`;

const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
`;

const DropdownContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoSkeleton = styled(Skeleton)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-bottom: 2px;
`;

const SymbolSkeleton = styled(Skeleton)`
  width: 40px;
  height: 16px;
`;

export const DropdownButton = ({ loading, sendingToken, onClick }) => (
  <Container onClick={onClick}>
    <DropdownContent>
      {loading ? (
        <LogoSkeleton />
      ) : (
        sendingToken && <TokenLogo src={sendingToken.logo} alt={`${sendingToken.symbol} logo`} />
      )}
      {loading ? <SymbolSkeleton /> : sendingToken?.symbol}
    </DropdownContent>
    <DropdownArrow />
  </Container>
);
