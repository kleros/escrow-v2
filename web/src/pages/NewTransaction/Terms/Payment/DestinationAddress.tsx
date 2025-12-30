import React, { useState, useEffect, useMemo } from "react";
import { TextField } from "@kleros/ui-components-library";
import { useDebounce } from "react-use";
import { useEnsAddress } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { ensDomainPattern, validateAddress } from "utils/validateAddress";
import { isEmpty } from "src/utils";

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

  const message = useMemo(() => {
    if (isEmpty(debouncedRecipientAddress) || isValid) {
      return "The ETH address or ENS of the person/entity that will receive the funds.";
    } else {
      return "The ETH address or ENS of the person/entity is not correct.";
    }
  }, [debouncedRecipientAddress, isValid]);

  const variant = useMemo(() => {
    if (isEmpty(debouncedRecipientAddress)) return "info";
    else if (isValid) return "success";
    else return "error";
  }, [debouncedRecipientAddress, isValid]);

  return (
    <TextField
      aria-label="Destination address"
      className="lg:w-fluid-342-574"
      value={recipientAddress}
      onChange={(value) => setRecipientAddress(value)}
      placeholder="eg. 0x123ABC... or john.eth"
      variant={variant}
      message={message}
    />
  );
};

export default DestinationAddress;
