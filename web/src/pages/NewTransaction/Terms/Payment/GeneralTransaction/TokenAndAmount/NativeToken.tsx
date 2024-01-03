import React from "react";
import styled from "styled-components";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryText};
  font-weight: 600;
  font-size: 16px;
`;

const NativeToken: React.FC = () => {
  const nativeTokenSymbol = useNativeTokenSymbol();

  return <StyledLabel>{nativeTokenSymbol}</StyledLabel>;
};

export default NativeToken;
