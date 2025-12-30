import React, { useState, useEffect, useMemo } from "react";
import { TextField } from "@kleros/ui-components-library";
import { useAccount, useEnsAddress, useEnsName } from "wagmi";
import { useDebounce } from "react-use";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { ensDomainPattern, validateAddress } from "utils/validateAddress";
import { cn, isEmpty } from "src/utils";
import SimpleToggleButton from "components/SimpleToggleButton";

const BuyerAddress: React.FC = () => {
  const { address: walletAddress } = useAccount();
  const { data: ensName } = useEnsName({
    address: walletAddress as `0x${string}` | undefined,
    chainId: 1,
  });

  const { buyerAddress, setBuyerAddress, isBuyerAddressCustom, setIsBuyerAddressCustom, setIsBuyerAddressResolved } =
    useNewTransactionContext();

  const displayAddress = useMemo(() => {
    if (ensName) return ensName;
    const addr = walletAddress || "";
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  }, [walletAddress, ensName]);

  useEffect(() => {
    if (!isBuyerAddressCustom && walletAddress) {
      setBuyerAddress(walletAddress);
      setIsBuyerAddressResolved(true);
    }
  }, [isBuyerAddressCustom, walletAddress, setBuyerAddress, setIsBuyerAddressResolved]);

  const [isValid, setIsValid] = useState(true);
  const [debouncedAddress, setDebouncedAddress] = useState(buyerAddress);
  const ensResult = useEnsAddress({ name: debouncedAddress, chainId: 1 });

  useDebounce(() => setDebouncedAddress(buyerAddress), 250, [buyerAddress]);

  useEffect(() => {
    if (!isBuyerAddressCustom) return;
    const valid = validateAddress(debouncedAddress);
    setIsValid(valid);
    setIsBuyerAddressResolved(valid);
    if (ensDomainPattern.test(debouncedAddress)) {
      const ensValid = !!ensResult.data;
      setIsValid(ensValid);
      setIsBuyerAddressResolved(ensValid);
    }
  }, [debouncedAddress, ensResult.data, isBuyerAddressCustom, setIsBuyerAddressResolved]);

  const message = useMemo(() => {
    if (!isBuyerAddressCustom) return "";
    if (isEmpty(debouncedAddress) || isValid) {
      return "This address will be responsible for managing the escrow from the side of the buyer.";
    }
    return "The ETH address or ENS of the person/entity is not correct.";
  }, [debouncedAddress, isValid, isBuyerAddressCustom]);

  const variant = useMemo(() => {
    if (!isBuyerAddressCustom || isEmpty(debouncedAddress)) return "info";
    return isValid ? "success" : "error";
  }, [debouncedAddress, isValid, isBuyerAddressCustom]);

  return (
    <div className="my-3">
      {!isBuyerAddressCustom && (
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <div className="flex flex-row gap-1.5">
            <label className="text-xs text-klerosUIComponentsSecondaryText">from:</label>
            <label className="text-xs text-klerosUIComponentsPrimaryText">{displayAddress}</label>
          </div>
          <SimpleToggleButton
            isOpen={false}
            label="Set buyer as different address"
            onClick={() => {
              setIsBuyerAddressCustom(true);
              setBuyerAddress("");
              setDebouncedAddress("");
              setIsBuyerAddressResolved(false);
              setIsValid(true);
            }}
          />
        </div>
      )}

      <div
        className={cn(
          "flex flex-col justify-center items-center",
          "overflow-hidden transition-[max-height_0.5s,opacity_0.5s_ease]",
          isBuyerAddressCustom ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mb-2">
          <SimpleToggleButton
            isOpen
            label={`Set buyer as the current address: ${displayAddress}`}
            onClick={() => {
              setIsBuyerAddressCustom(false);
              setBuyerAddress(walletAddress ?? "");
              setIsBuyerAddressResolved(true);
            }}
          />
        </div>
        <TextField
          aria-label="Buyer address"
          className="lg:w-fluid-342-574"
          value={buyerAddress}
          onChange={(value) => setBuyerAddress(value)}
          placeholder="eg. 0x123ABC... or john.eth"
          variant={variant}
          message={message}
          maxLength={42}
        />
      </div>
    </div>
  );
};

export default BuyerAddress;
