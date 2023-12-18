import React from "react";
import styled from "styled-components";

const StyledP = styled.p`
  display: flex;
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
  margin-bottom: 32px;
`;

const Description: React.FC = () => {
  return <StyledP>How much should be paid?</StyledP>;
};
export default Description;
