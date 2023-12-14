import React from "react";
import styled, { Theme } from "styled-components";
import { Statuses } from "consts/statuses";

const Container = styled.div<Omit<IStatusBanner, "id">>`
  height: ${({ isCard }) => (isCard ? "45px" : "100%")};
  width: auto;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  .dot {
    ::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  ${({ theme, status, isCard }) => {
    const [frontColor, backgroundColor] = getStatusColors(status, theme);
    return `
      ${isCard ? `border-top: 5px solid ${frontColor}` : `border-left: 5px solid ${frontColor}`};
      ${isCard && `background-color: ${backgroundColor}`};
      .front-color {
        color: ${frontColor};
      }
      .dot {
        ::before {
          background-color: ${frontColor};
        }
      }
    `;
  }};
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

const StatusBanner: React.FC<IStatusBanner> = ({ id, status, isCard = true }) => (
  <Container status={status} isCard={isCard}>
    {isCard && <label className="front-color dot">{getStatusLabel(status)}</label>}
    <label className="front-color">#{id}</label>
  </Container>
);

export default StatusBanner;
