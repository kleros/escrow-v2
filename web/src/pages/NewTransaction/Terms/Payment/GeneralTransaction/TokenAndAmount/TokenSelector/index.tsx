import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import { Alchemy } from "alchemy-sdk";
import { useAccount } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { initializeTokens } from "utils/initializeTokens";
import { alchemyConfig } from "utils/alchemyConfig";
import { useLocalStorage } from "hooks/useLocalStorage";
import { DropdownButton } from "./DropdownButton";
import { TokenListModal } from "./TokenListModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const TokenSelector: React.FC = () => {
  const { address, chain } = useAccount();
  const { sendingToken, setSendingToken } = useNewTransactionContext();
  const [tokens, setTokens] = useLocalStorage("tokens", []);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const alchemyInstance = useMemo(() => chain && new Alchemy(alchemyConfig(chain?.id)), [chain]);

  useClickAway(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (address && alchemyInstance && chain) {
      localStorage.removeItem("tokens");
      initializeTokens(address, setTokens, setLoading, chain.id, alchemyInstance);
    }
  }, [address, chain, alchemyInstance]);

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

  return (
    <Container>
      <DropdownButton {...{ loading, sendingToken }} onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <TokenListModal {...{ setIsOpen, tokens, setTokens, handleSelectToken }} />}
    </Container>
  );
};

export default TokenSelector;
