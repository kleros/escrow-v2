import React, { useMemo } from "react";
import styled, { Theme, useTheme, css } from "styled-components";
import { Statuses } from "consts/statuses";

interface IContainer {
  isCard: boolean;
  frontColor: string;
  backgroundColor: string;
}

const Container = styled.div<IContainer>`
  height: ${({ isCard }) => (isCard ? "45px" : "100%")};
  width: auto;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  ${({ isCard, frontColor, backgroundColor }) => {
    return `
      ${isCard ? `border-top: 5px solid ${frontColor}` : `border-left: 5px solid ${frontColor}`};
      ${isCard ? `background-color: ${backgroundColor}` : null};
    `;
  }};
`;

const StyledLabel = styled.label<{ frontColor: string, withDot?: boolean }>`
  color: ${({ frontColor }) => frontColor};
  ${({ withDot, frontColor }) => withDot ? css`
    ::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
      background-color: ${frontColor};
    }
  ` : null}
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
    case Statuses.disputed:
      return [theme.secondaryPurple, theme.mediumPurple];
    case Statuses.concluded:
      return [theme.success, theme.successLight];
    case Statuses.settlement:
      return [theme.warning, theme.warningLight];
    default:
      return [theme.primaryBlue, theme.mediumBlue];
  }
};

const getStatusLabel = (status: Statuses): string => {
  switch (status) {
    case Statuses.inProgress:
      return "In Progress";
    case Statuses.disputed:
      return "Disputed";
    case Statuses.settlement:
      return "Settlement";
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
    <Container {...{ isCard, frontColor, backgroundColor}}>
      {isCard ? <StyledLabel frontColor={frontColor} withDot>{getStatusLabel(status)}</StyledLabel> : null}
      <StyledLabel frontColor={frontColor}>#{id}</StyledLabel>
    </Container>
  );
}

export default StatusBanner;
