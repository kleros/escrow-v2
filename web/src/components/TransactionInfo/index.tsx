import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Statuses } from "consts/statuses";
import { useIsList } from "context/IsListProvider";
import CalendarIcon from "svgs/icons/calendar.svg";
import PileCoinsIcon from "svgs/icons/pile-coins.svg";
import UserIcon from "svgs/icons/user.svg";
import Field from "./Field";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div<{ isList: boolean; isPreview?: boolean }>`
  display: flex;
  width: 100%;
  gap: 8px;
  flex-direction: column;
  justify-content: flex-end;

  ${({ isList }) =>
    isList &&
    css`
      ${landscapeStyle(
        () => css`
          gap: 0;
          height: 100%;
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

  ${({ isList }) =>
    isList &&
    css`
      ${landscapeStyle(
        () => css`
          flex-direction: row;
          gap: ${responsiveSize(4, 24, 300, 900)};
          justify-content: space-around;
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
  deadlineDate: Date;
  token?: string;
  status?: Statuses;
  overrideIsList?: boolean;
  isPreview?: boolean;
  receiverAddress?: string;
}

const TransactionInfo: React.FC<ITransactionInfo> = ({
  amount,
  token,
  deadlineDate,
  status,
  receiverAddress,
  overrideIsList,
  isPreview,
}) => {
  const { isList } = useIsList();
  const displayAsList = isList && !overrideIsList;

  return (
    <Container isList={displayAsList} isPreview={isPreview}>
      <RestOfFieldsContainer isPreview={isPreview} isList={displayAsList}>
        {amount && token ? (
          <Field
            icon={PileCoinsIcon}
            name="Amount"
            value={`${amount} ${token}`}
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {receiverAddress ? (
          <Field
            icon={UserIcon}
            name="Receiver"
            value={receiverAddress}
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
      </RestOfFieldsContainer>
    </Container>
  );
};
export default TransactionInfo;
