import React, { useMemo } from "react";
import styled, { Theme, useTheme, css } from "styled-components";
import { Statuses } from "consts/statuses";
import { responsiveSize } from "styles/responsiveSize";

interface IContainer {
  isCard: boolean;
  frontColor: string;
  backgroundColor: string;
}

const Container = styled.div<IContainer>`
  display: flex;
  height: ${({ isCard }) => (isCard ? "45px" : "100%")};
  width: ${({ isCard }) => (isCard ? "auto" : responsiveSize(60, 80, 900))};
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  justify-content: ${({ isCard }) => (isCard ? "space-between" : "start")};
  ${({ isCard, frontColor, backgroundColor }) => {
    return `
      ${isCard ? `border-top: 5px solid ${frontColor}` : `border-left: 5px solid ${frontColor}`};
      ${isCard ? `background-color: ${backgroundColor}` : null};
    `;
  }};
`;

const StyledLabel = styled.label<{ frontColor: string; withDot?: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ frontColor }) => frontColor};

  ${({ withDot, frontColor }) =>
    withDot
      ? css`
          ::before {
            content: "";
            height: 8px;
            width: 8px;
            border-radius: 50%;
            margin-right: 8px;
            background-color: ${frontColor};
            flex-shrink: 0;
          }
        `
      : null}
`;

export interface IStatusBanner {
  id: number;
  status: Statuses;
  isCard?: boolean;
}

const getStatusColors = (status: Statuses, theme: Theme): [string, string] => {
  switch (status) {
    case Statuses.inProgress:
      return [theme.primaryBlue, theme.mediumBlue];
    case Statuses.settlementWaitingBuyer:
      return [theme.warning, theme.warningLight];
    case Statuses.settlementWaitingSeller:
      return [theme.warning, theme.warningLight];
    case Statuses.raisingDisputeWaitingBuyer:
      return [theme.warning, theme.warningLight];
    case Statuses.raisingDisputeWaitingSeller:
      return [theme.warning, theme.warningLight];
    case Statuses.disputed:
      return [theme.secondaryPurple, theme.mediumPurple];
    case Statuses.concluded:
      return [theme.success, theme.successLight];
    default:
      return [theme.primaryBlue, theme.mediumBlue];
  }
};

const getStatusLabel = (status: Statuses): string => {
  switch (status) {
    case Statuses.inProgress:
      return "In Progress";
    case Statuses.settlementWaitingBuyer:
      return "Settlement - Waiting Buyer";
    case Statuses.settlementWaitingSeller:
      return "Settlement - Waiting Seller";
    case Statuses.raisingDisputeWaitingBuyer:
      return "Raising a Dispute - Waiting Buyer";
    case Statuses.raisingDisputeWaitingSeller:
      return "Raising a Dispute - Waiting Seller";
    case Statuses.disputed:
      return "Disputed";
    case Statuses.concluded:
      return "Concluded";
    default:
      return "In Progress";
  }
};

const StatusBanner: React.FC<IStatusBanner> = ({ id, status, isCard = true }) => {
  const theme = useTheme();
  const [frontColor, backgroundColor] = useMemo(() => getStatusColors(status, theme), [theme, status]);
  return (
    <Container {...{ isCard, frontColor, backgroundColor }}>
      <StyledLabel frontColor={frontColor} withDot>
        {getStatusLabel(status)}
      </StyledLabel>
      <StyledLabel frontColor={frontColor}>#{id}</StyledLabel>
    </Container>
  );
};

export default StatusBanner;
