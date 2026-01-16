import React, { useState } from "react";
import { Modal, Searchbar } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";
import TokenItem from "./TokenItem";
import { useFilteredTokens } from "hooks/useFilteredTokens";
import clsx from "clsx";
import { baseModalStyle } from "~src/styles/modalStyles";

export const TokenListModal = ({ isOpen, setIsOpen, tokens, setTokens, handleSelectToken }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { sendingToken } = useNewTransactionContext();
  const { filteredTokens } = useFilteredTokens(searchQuery, tokens, setTokens, sendingToken);

  return (
    <Modal
      className={clsx(baseModalStyle, "w-fluid-320-500 lg:w-[500px]")}
      isOpen={isOpen}
      isDismissable
      onOpenChange={setIsOpen}
    >
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
    </Modal>
  );
};
