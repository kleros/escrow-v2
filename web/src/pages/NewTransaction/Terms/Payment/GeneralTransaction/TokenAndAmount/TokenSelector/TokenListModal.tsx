import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import { Searchbar } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { Overlay } from "components/Overlay";
import TokenItem from "./TokenItem";
import { StyledModal } from "pages/MyTransactions/Modal/StyledModal";
import { useFilteredTokens } from "hooks/useFilteredTokens";

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

export const TokenListModal = ({ setIsOpen, tokens, setTokens, handleSelectToken }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { sendingToken } = useNewTransactionContext();
  const { filteredTokens } = useFilteredTokens(searchQuery, tokens, setTokens, sendingToken);
  const containerRef = useRef(null);
  useClickAway(containerRef, () => setIsOpen(false));

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <StyledP>Select a token</StyledP>
        <StyledSearchbar
          placeholder="Search by name or paste address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ItemsContainer>
          {filteredTokens.map((token) => (
            <TokenItem
              key={token.address}
              selected={sendingToken?.address === token.address}
              onSelect={handleSelectToken}
              {...{ token }}
            />
          ))}
        </ItemsContainer>
      </ReStyledModal>
    </>
  );
};
