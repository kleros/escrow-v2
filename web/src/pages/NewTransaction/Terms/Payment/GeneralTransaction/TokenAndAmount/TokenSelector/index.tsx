import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { useClickAway } from "react-use";
import { Searchbar } from "@kleros/ui-components-library";
import { Alchemy } from "alchemy-sdk";
import { useAccount, useNetwork } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { initializeTokens } from "utils/initializeTokens";
import { alchemyConfig } from "utils/alchemyConfig";
import { Overlay } from "components/Overlay";
import { StyledModal } from "pages/MyTransactions/Modal/StyledModal";
import { useLocalStorage } from "hooks/useLocalStorage";

const Container = styled.div`
  position: relative;
  width: 186px;
  height: 45px;
`;

const TokenSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const DropdownButton = styled.div`
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 3px;
  padding: 9.5px 8px;
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

export const Item = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.lightBlue};
  }
  ${({ selected, theme }) =>
    selected &&
    `
    background: ${theme.mediumBlue};
    border-left: 3px solid ${theme.primaryBlue};
    padding-left: 13px;
    &:hover {
      background: ${theme.mediumBlue};
    }
  `}
`;

export const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
`;

export const TokenLabel = styled.span`
  color: ${({ theme }) => theme.primaryText};
`;

const DropdownContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledLogoSkeleton = styled(Skeleton)`
  width: 22.5px;
  height: 22.5px;
  margin-left: 2px;
  border-radius: 50%;
`;

const ReStyledModal = styled(StyledModal)`
  display: flex;
  width: 500px;
`;

const StyledSearchbar = styled(Searchbar)`
  width: 100%;
  input {
    font-size: 16px;
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 24px;
`;

const StyledP = styled.p`
  display: flex;
  align-self: flex-start;
  font-weight: 600;
  margin: 0;
  margin-bottom: 28px;
`;

const TokenSelector = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { sendingToken, setSendingToken } = useNewTransactionContext();
  const [tokens, setTokens] = useLocalStorage("tokens", []);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const alchemyInstance = new Alchemy(alchemyConfig(chain?.id));
  useClickAway(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (address && chain) {
      initializeTokens(address, setTokens, setLoading, chain, alchemyInstance);
    }
  }, [address, chain]);

  useEffect(() => {
    if (tokens?.length > 0) {
      const nativeToken = tokens.find((token) => token.address === "native");
      setSendingToken(JSON.parse(localStorage.getItem("selectedToken")) || nativeToken);
    }
  }, [tokens, setSendingToken]);

  const handleSelectToken = (token) => {
    setSendingToken(token);
    localStorage.setItem("selectedToken", JSON.stringify(token));
    setIsOpen(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredTokens(tokens);
      return;
    }

    const isAddress = query.startsWith("0x") && query.length === 42;
    if (isAddress) {
      try {
        const metadata = await alchemyInstance.core.getTokenMetadata(query.toLowerCase());
        const resultToken = {
          symbol: metadata.symbol,
          address: query.toLowerCase(),
          logo: metadata.logo || "https://via.placeholder.com/24",
        };

        const updatedTokens = [...tokens, resultToken];
        const uniqueTokens = Array.from(new Set(updatedTokens.map((a) => a.address))).map((address) => {
          return updatedTokens.find((a) => a.address === address);
        });

        setFilteredTokens([resultToken]);
        setTokens(uniqueTokens);
        localStorage.setItem("tokens", JSON.stringify(uniqueTokens));
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    } else {
      const filteredTokens = tokens.filter((token) => token.symbol.toLowerCase().includes(query.toLowerCase()));
      setFilteredTokens(filteredTokens);
    }
  };

  const tokensToDisplay = searchQuery
    ? filteredTokens
    : [sendingToken, ...tokens.filter((token) => token.address !== sendingToken?.address)];

  return (
    <TokenSelectorWrapper>
      <Container ref={containerRef}>
        <DropdownButton onClick={() => setIsOpen(!isOpen)}>
          <DropdownContent>
            {loading ? (
              <StyledLogoSkeleton />
            ) : (
              sendingToken && <TokenLogo src={sendingToken.logo} alt={`${sendingToken.symbol} logo`} />
            )}
            {loading ? <Skeleton width={40} height={16} /> : sendingToken?.symbol}
          </DropdownContent>
          <DropdownArrow />
        </DropdownButton>
        {isOpen && (
          <>
            <Overlay />
            <ReStyledModal ref={containerRef}>
              <StyledP>Select a token</StyledP>
              <StyledSearchbar
                placeholder="Search by name or paste address"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <ItemsContainer>
                {tokensToDisplay?.map((token) => (
                  <Item
                    key={token.address}
                    onClick={() => handleSelectToken(token)}
                    selected={sendingToken?.address === token.address}
                  >
                    <TokenLogo src={token.logo} alt={`${token?.symbol} logo`} />
                    <TokenLabel>{token.symbol}</TokenLabel>
                  </Item>
                ))}
              </ItemsContainer>
            </ReStyledModal>
          </>
        )}
      </Container>
    </TokenSelectorWrapper>
  );
};

export default TokenSelector;
