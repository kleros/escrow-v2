import React from "react";
import styled, { css } from "styled-components";
import Skeleton from "react-loading-skeleton";
import { landscapeStyle } from "styles/landscapeStyle";
import { Statuses } from "consts/statuses";
import { useIsList } from "context/IsListProvider";
import CalendarIcon from "svgs/icons/calendar.svg";
import PileCoinsIcon from "svgs/icons/pile-coins.svg";
import UserIcon from "svgs/icons/user.svg";
import Field from "./Field";
import { shortenAddress } from "utils/shortenAddress";

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

export interface ITransactionInfo {
  amount?: string;
  deadlineDate: string;
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
  deadlineDate,
  sellerAddress,
  buyerAddress,
  overrideIsList,
  isPreview,
}) => {
  const { isList } = useIsList();
  const displayAsList = isList && !overrideIsList;

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
        {deadlineDate ? (
          <Field
            icon={CalendarIcon}
            name="Delivery Deadline"
            value={deadlineDate}
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {buyerAddress ? (
          <Field
            icon={UserIcon}
            name="Buyer"
            value={shortenAddress(buyerAddress)}
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {sellerAddress ? (
          <Field
            icon={UserIcon}
            name="Seller"
            value={shortenAddress(sellerAddress)}
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
      </RestOfFieldsContainer>
    </Container>
  );
};

export default TransactionInfo;
