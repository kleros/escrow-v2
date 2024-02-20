import React from "react";
import styled from "styled-components";
import CheckCircle from "svgs/icons/check-circle-outline.svg";

const StyledCheckCircle = styled(CheckCircle)`
  path {
    fill: ${({ theme }) => theme.success};
  }
`;

const CheckCircleIcon: React.FC = () => {
  return <StyledCheckCircle />;
};
export default CheckCircleIcon;
