import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useClickAway } from "react-use";
import { Tabs } from "@kleros/ui-components-library";
import { useAccount, useNetwork } from "wagmi";
import { Alchemy } from "alchemy-sdk";
import alchemyConfig from "./alchemyConfig";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { fetchNativeToken } from "utils/fetchNativeToken";
import { fetchOwnedTokensFromAlchemy } from "utils/fetchOwnedTokensFromAlchemy";
import { fetchTokenInfo } from "utils/fetchTokenInfo";
import { validateAddress } from "../../../DestinationAddress";
import TokensTab from "./TokensTab";
import AddCustomTokenTab from "./AddCustomTokenTab";
import { StyledModal } from "pages/MyTransactions/Modal/StyledModal";
import { Overlay } from "components/Overlay";

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

const TokenSelector: React.FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { sendingToken, setSendingToken } = useNewTransactionContext();
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [customToken, setCustomToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tokens");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const alchemy = new Alchemy(alchemyConfig(chain?.id));
  useClickAway(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (address && chain) {
      fetchOwnedTokensFromAlchemy(alchemy, address, setOwnedTokens, setLoading, chain);
      setSendingToken(fetchNativeToken(chain).value);
    }
  }, [address, chain, setSendingToken]);

  const handleAddCustomToken = async () => {
    if (!validateAddress(customToken)) {
      alert("Invalid address");
      return;
    }
    const tokenInfo = await fetchTokenInfo(alchemy, customToken);
    setOwnedTokens([...ownedTokens, { label: tokenInfo.symbol, value: customToken, logo: tokenInfo.logo }]);
    setCustomToken("");
  };

  const handleSelectToken = (value: string) => {
    setSendingToken(value);
    setIsOpen(false);
  };

  const filteredTokens = ownedTokens.filter((token) =>
    token?.label?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  return (
    <TokenSelectorWrapper>
      <Container ref={containerRef}>
        <DropdownButton onClick={() => setIsOpen(!isOpen)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {loading ? (
              <Skeleton circle width={24} height={24} />
            ) : (
              sendingToken && (
                <TokenLogo
                  src={ownedTokens.find((token) => token.value === sendingToken)?.logo}
                  alt={`${sendingToken} logo`}
                />
              )
            )}
            {loading ? (
              <Skeleton width={80} height={20} style={{ marginLeft: 8 }} />
            ) : sendingToken ? (
              ownedTokens.find((token) => token.value === sendingToken)?.label
            ) : (
              "Select a token"
            )}
          </div>
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
                  customToken={customToken}
                  setCustomToken={setCustomToken}
                  handleAddCustomToken={handleAddCustomToken}
                  validateAddress={validateAddress}
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