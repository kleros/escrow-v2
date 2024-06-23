import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Copiable } from "@kleros/ui-components-library";
import { useEnsName } from "wagmi";
import Skeleton from "react-loading-skeleton";
import { Statuses } from "consts/statuses";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "consts/chains";
import { useIsList } from "context/IsListProvider";
import { shortenAddress } from "utils/shortenAddress";
import CalendarIcon from "svgs/icons/calendar.svg";
import PileCoinsIcon from "svgs/icons/pile-coins.svg";
import UserIcon from "svgs/icons/user.svg";
import Field from "./Field";

const Container = styled.div<{ isList: boolean; isPreview?: boolean }>`
  display: flex;
  width: 100%;
  gap: 8px;
  flex-direction: column;
  justify-content: center;

  ${({ isList }) =>
    isList &&
    css`
      ${landscapeStyle(
        () => css`
          gap: 0;
          height: 100%;
          flex: 1;
        `
      )}
    `};
`;

const RestOfFieldsContainer = styled.div<{ isList?: boolean; isPreview?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  ${({ isList, isPreview }) =>
    isList &&
    !isPreview &&
    css`
      ${landscapeStyle(
        () => css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-self: flex-end;
          width: auto;
          max-width: 360px;
          height: auto;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px 32px;
          margin-right: 35px;
        `
      )}
    `};
  ${({ isPreview }) =>
    isPreview &&
    css`
      gap: 32px;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
    `};
`;

const StyledA = styled.a`
  color: ${({ theme }) => theme.primaryText};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.primaryBlue};
  }
`;

export interface ITransactionInfo {
  amount?: string;
  deadline: number;
  assetSymbol?: string;
  status?: Statuses;
  overrideIsList?: boolean;
  isPreview?: boolean;
  sellerAddress?: string;
  buyerAddress?: string;
}

const TransactionInfo: React.FC<ITransactionInfo> = ({
  amount,
  assetSymbol,
  deadline,
  sellerAddress,
  buyerAddress,
  overrideIsList,
  isPreview,
}) => {
  const { isList } = useIsList();
  const displayAsList = isList && !overrideIsList;

  const buyerEns = useEnsName({ address: buyerAddress, chainId: 1 });
  const sellerEns = useEnsName({ address: sellerAddress, chainId: 1 });

  const displayBuyerAddress = buyerEns.data || shortenAddress(buyerAddress);
  const displaySellerAddress = sellerEns.data || shortenAddress(sellerAddress);

  return (
    <Container isList={displayAsList} isPreview={isPreview}>
      <RestOfFieldsContainer isPreview={isPreview} isList={displayAsList}>
        {amount ? (
          <Field
            icon={PileCoinsIcon}
            name="Amount"
            value={
              <>
                {amount} {!assetSymbol ? <Skeleton width={30} /> : assetSymbol}
              </>
            }
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {deadline ? (
          <Field
            icon={CalendarIcon}
            name="Delivery Deadline"
            value={new Date(deadline).toLocaleString()}
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {buyerAddress ? (
          <Field
            icon={UserIcon}
            name="Buyer"
            value={
              isPreview ? (
                <Copiable copiableContent={buyerAddress ?? ""} info="Copy Buyer Address">
                  <StyledA
                    href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${buyerAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {displayBuyerAddress}
                  </StyledA>
                </Copiable>
              ) : (
                displayBuyerAddress
              )
            }
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {sellerAddress ? (
          <Field
            icon={UserIcon}
            name="Seller"
            value={
              isPreview ? (
                <Copiable copiableContent={sellerAddress ?? ""} info="Copy Seller Address">
                  <StyledA
                    href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${sellerAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {displaySellerAddress}
                  </StyledA>
                </Copiable>
              ) : (
                displaySellerAddress
              )
            }
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
      </RestOfFieldsContainer>
    </Container>
  );
};

export default TransactionInfo;
