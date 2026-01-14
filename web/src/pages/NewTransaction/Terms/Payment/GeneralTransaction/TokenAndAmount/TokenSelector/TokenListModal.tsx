import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Searchbar } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { Overlay } from "components/Overlay";
import TokenItem from "./TokenItem";
import StyledModal from "pages/MyTransactions/Modal/StyledModal";
import { useFilteredTokens } from "hooks/useFilteredTokens";

export const TokenListModal = ({ setIsOpen, tokens, setTokens, handleSelectToken }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { sendingToken } = useNewTransactionContext();
  const { filteredTokens } = useFilteredTokens(searchQuery, tokens, setTokens, sendingToken);
  const containerRef = useRef(null);
  useClickAway(containerRef, () => setIsOpen(false));

  return (
    <Overlay>
      <StyledModal className="w-fluid-320-500 lg:w-[500px]" ref={containerRef}>
        <p className="flex self-start font-semibold m-0 mb-7">Select a token</p>
        <Searchbar
          className="w-full"
          aria-label="Search by name or paste address"
          placeholder="Search by name or paste address"
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
        <div className="flex flex-col w-full mt-6">
          {filteredTokens.map((token) => (
            <TokenItem
              key={token.address}
              selected={sendingToken?.address === token.address}
              onSelect={handleSelectToken}
              {...{ token }}
            />
          ))}
        </div>
      </StyledModal>
    </Overlay>
  );
};
