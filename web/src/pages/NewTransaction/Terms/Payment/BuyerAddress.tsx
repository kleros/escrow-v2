import React, { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { Field } from "@kleros/ui-components-library";
import { useAccount, useEnsAddress } from "wagmi";
import { useDebounce } from "react-use";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { ensDomainPattern, validateAddress } from "utils/validateAddress";
import { isEmpty } from "src/utils";
import SimpleToggleButton from "components/SimpleToggleButton";

const Container = styled.div`
  margin-bottom: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
`;

const StyledField = styled(Field)`
  margin-bottom: ${responsiveSize(68, 40)};

  small {
    margin-top: 6px;
    svg {
      margin-top: 8px;
    }
  }

  input {
    font-size: 16px;
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 574)};
    `
  )};
`;

const Collapse = styled.div<{ $open: boolean; }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: ${({ $open }) => ($open ? "160px" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  overflow: hidden;
  transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease;
`;

const SecondaryLabel = styled.label`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 12px;
`;

const PrimaryLabel = styled.label`
  color: ${({ theme }) => theme.primaryText};
  font-size: 12px;
`;

const BuyerAddress: React.FC = () => {
  const { address: walletAddress } = useAccount();
  const {
    buyerAddress,
    setBuyerAddress,
    isBuyerAddressCustom,
    setIsBuyerAddressCustom,
    setIsBuyerAddressResolved,
  } = useNewTransactionContext();

  const displayAddress = useMemo(() => {
    const addr = walletAddress || "";
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  }, [walletAddress]);

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

  const handleWrite = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyerAddress(e.target.value);
  };

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
    <Container>
      {!isBuyerAddressCustom && (
        <InfoRow>
          <SecondaryLabel>from:</SecondaryLabel>
          <PrimaryLabel>{displayAddress}</PrimaryLabel>
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
        </InfoRow>
      )}

      <Collapse $open={isBuyerAddressCustom}>
        <SimpleToggleButton
          isOpen
          label={`Set buyer as the current address: ${displayAddress}`}
          onClick={() => {
            setIsBuyerAddressCustom(false);
            setBuyerAddress(walletAddress ?? "");
            setIsBuyerAddressResolved(true);
          }}
        />

        <StyledField
          type="text"
          value={buyerAddress}
          onChange={handleWrite}
          placeholder="eg. 0x123ABC... or john.eth"
          variant={variant}
          message={message}
          maxLength={42}
        />
      </Collapse>
    </Container>
  );
};

export default BuyerAddress;
