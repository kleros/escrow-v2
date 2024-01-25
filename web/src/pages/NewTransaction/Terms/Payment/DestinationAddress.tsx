import React, { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Field } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import { useEnsAddress } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { useDebounce } from "react-use";

const StyledField = styled(Field)`
  width: 84vw;
  margin-bottom: ${responsiveSize(68, 40)};

  input {
    font-size: 16px;
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 574)};
    `
  )}
`;

export const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;
export const ensDomainPattern = /^[a-zA-Z0-9-]{1,}\.eth$/;

export const validateAddress = (input: string) => {
  return ethAddressPattern.test(input) || ensDomainPattern.test(input);
};

interface IDestinationAddress {
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
}

const DestinationAddress: React.FC<IDestinationAddress> = ({ recipientAddress, setRecipientAddress }) => {
  const [isValid, setIsValid] = useState(true);
  const [debouncedRecipientAddress, setDebouncedRecipientAddress] = useState(recipientAddress);
  const ensResult = useEnsAddress({ name: debouncedRecipientAddress, chainId: 1 });
  const { setIsRecipientAddressResolved } = useNewTransactionContext();

  useDebounce(() => setDebouncedRecipientAddress(recipientAddress), 350, [recipientAddress]);

  useEffect(() => {
    const isAddressValid = validateAddress(debouncedRecipientAddress);
    setIsValid(isAddressValid);
    setIsRecipientAddressResolved(isAddressValid);

    if (ensDomainPattern.test(debouncedRecipientAddress)) {
      setIsValid(!!ensResult.data);
      setIsRecipientAddressResolved(!!ensResult.data);
    }
  }, [debouncedRecipientAddress, ensResult.data, setIsRecipientAddressResolved]);

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setRecipientAddress(input);
  };

  const message = useMemo(() => {
    if (debouncedRecipientAddress === "" || isValid) {
      return "The ETH address or ENS of the person/entity that will receive the funds.";
    } else {
      return "The ETH address or ENS of the person/entity is not correct.";
    }
  }, [debouncedRecipientAddress, isValid]);

  const variant = useMemo(() => {
    if (debouncedRecipientAddress === "") return "info";
    else if (isValid) return "success";
    else return "error";
  }, [debouncedRecipientAddress, isValid]);

  return (
    <StyledField
      type="text"
      value={recipientAddress}
      onChange={handleWrite}
      placeholder="eg. 0x123ABC... or john.eth"
      variant={variant}
      message={message}
      maxLength={42}
    />
  );
};

export default DestinationAddress;
