import React, { useState, useEffect, useRef, useMemo } from "react";
import { useClickAway } from "react-use";
import { Alchemy } from "alchemy-sdk";
import { useAccount } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { initializeTokens, TOKENS_STORAGE_KEY } from "utils/initializeTokens";
import { alchemyConfig } from "utils/alchemyConfig";
import { useLocalStorage } from "hooks/useLocalStorage";
import { DropdownButton } from "./DropdownButton";
import { TokenListModal } from "./TokenListModal";

const SELECTED_TOKEN_STORAGE_KEY = "selectedToken";

const TokenSelector: React.FC = () => {
  const { address, chain } = useAccount();
  const { sendingToken, setSendingToken } = useNewTransactionContext();
  const [tokens, setTokens] = useLocalStorage(TOKENS_STORAGE_KEY, []);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const alchemyInstance = useMemo(() => chain && new Alchemy(alchemyConfig(chain?.id)), [chain]);

  useClickAway(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (address && alchemyInstance && chain) {
      localStorage.removeItem(TOKENS_STORAGE_KEY);
      initializeTokens(address, setTokens, setLoading, chain.id, alchemyInstance);
    }
  }, [address, chain, alchemyInstance]);

  useEffect(() => {
    if (tokens?.length > 0) {
      const nativeToken = tokens.find((token) => token.address === "native");
      setSendingToken(JSON.parse(localStorage.getItem(SELECTED_TOKEN_STORAGE_KEY) ?? "null") || nativeToken);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  const handleSelectToken = (token) => {
    setSendingToken(token);
    localStorage.setItem(SELECTED_TOKEN_STORAGE_KEY, JSON.stringify(token));
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <DropdownButton {...{ loading, sendingToken }} onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <TokenListModal {...{ isOpen, setIsOpen, tokens, setTokens, handleSelectToken }} />}
    </div>
  );
};

export default TokenSelector;
