import React from "react";
import styled from "styled-components";
import CheckCircleFull from "svgs/icons/check-circle-full.svg";

const StyledCheckCircleFull = styled(CheckCircleFull)`
  margin-bottom: 12px;
`;

const VerifiedLogo: React.FC = () => {
  return <StyledCheckCircleFull />;
};
export default VerifiedLogo;
