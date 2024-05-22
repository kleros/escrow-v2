import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { useClickAway } from "react-use";
import { Tabs } from "@kleros/ui-components-library";
import { Alchemy } from "alchemy-sdk";
import { useAccount, useNetwork } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { initializeTokens } from "utils/initializeTokens";
import { alchemyConfig } from "utils/alchemyConfig";
import { Overlay } from "components/Overlay";
import TokensTab from "./TokensTab";
import AddCustomTokenTab from "./AddCustomTokenTab";
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
  padding: 8px;
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

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.mediumBlue};
  }
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

const TokenSelector: React.FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { sendingToken, setSendingToken } = useNewTransactionContext();
  const [tokens, setTokens] = useLocalStorage<any[]>("tokens", []);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tokens");
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
    if (tokens.length > 0) {
      const nativeToken = tokens.find((token) => token.value === "native");
      setSendingToken(localStorage.getItem("selectedToken") || nativeToken.value);
    }
  }, [tokens]);

  const handleSelectToken = (value: string) => {
    setSendingToken(value);
    localStorage.setItem("selectedToken", value);
    setIsOpen(false);
  };

  const filteredTokens =
    tokens && tokens.filter((token) => token?.label?.toLowerCase().includes(searchQuery?.toLowerCase()));

  return (
    <TokenSelectorWrapper>
      <Container ref={containerRef}>
        <DropdownButton onClick={() => setIsOpen(!isOpen)}>
          <DropdownContent>
            {loading ? (
              <StyledLogoSkeleton />
            ) : (
              sendingToken && (
                <TokenLogo
                  src={tokens.find((token) => token.value === sendingToken)?.logo}
                  alt={`${sendingToken} logo`}
                />
              )
            )}
            {loading ? (
              <Skeleton width={40} height={16} />
            ) : sendingToken ? (
              tokens.find((token) => token.value === sendingToken)?.label
            ) : (
              "Select a token"
            )}
          </DropdownContent>
          <DropdownArrow />
        </DropdownButton>
        {isOpen && (
          <>
            <Overlay />
            <StyledModal ref={containerRef}>
              <Tabs
                items={[
                  { text: "Tokens", value: "tokens" },
                  { text: "Add Custom Token", value: "addCustomToken" },
                ]}
                callback={setActiveTab}
                currentValue={activeTab}
              />
              {activeTab === "tokens" && (
                <TokensTab
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filteredTokens={filteredTokens}
                  handleSelectToken={handleSelectToken}
                />
              )}
              {activeTab === "addCustomToken" && (
                <AddCustomTokenTab
                  setTokens={setTokens}
                  setActiveTab={setActiveTab}
                  alchemyInstance={alchemyInstance}
                />
              )}
            </StyledModal>
          </>
        )}
      </Container>
    </TokenSelectorWrapper>
  );
};

export default TokenSelector;
