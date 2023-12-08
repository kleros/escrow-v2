import React, { useState } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Field } from "@kleros/ui-components-library";
import { calcMinMax } from "utils/calcMinMax";
import { useNewTransactionContext } from "context/NewTransactionContext";

const StyledField = styled(Field)`
  width: 84vw;
  margin-bottom: ${calcMinMax(68, 40)};

  ${landscapeStyle(
    () => css`
      width: ${calcMinMax(342, 574)};
    `
  )}
`;

export const validateAddress = (input: string) => {
  const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;
  const ensDomainPattern = /^[a-zA-Z0-9-]{1,}\.eth$/;
  return ethAddressPattern.test(input) || ensDomainPattern.test(input);
};

const DestinationAddress: React.FC = () => {
  const [isValid, setIsValid] = useState(true);
  const { paymentRecipientAddress, setPaymentRecipientAddress } = useNewTransactionContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setPaymentRecipientAddress(event.target.value);
    setIsValid(validateAddress(input) || input === "");
  };

  const message = isValid
    ? "The ETH address or ENS of the person/entity that will receive the funds after the contract is complete. (Note: Do not use an exchange wallet address.)"
    : "The ETH address or ENS of the person/entity that will receive the funds is not correct.";

  const variant = paymentRecipientAddress === "" ? "info" : isValid ? "success" : "error";

  return (
    <StyledField
      type="text"
      value={paymentRecipientAddress}
      onChange={handleWrite}
      placeholder="eg. 0x123456789a123456789b123456789123456789cd or John.eth"
      variant={variant}
      message={message}
      maxLength={42}
    />
  );
};

export default DestinationAddress;
