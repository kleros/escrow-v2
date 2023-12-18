import React from "react";
import styled from "styled-components";
import Hourglass from "svgs/icons/hourglass.svg";

const StyledHourglass = styled(Hourglass)`
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const HourglassIcon: React.FC = () => {
  return <StyledHourglass />;
};
export default HourglassIcon;
