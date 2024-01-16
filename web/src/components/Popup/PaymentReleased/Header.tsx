import React from "react";
import styled from "styled-components";
import { formatEther } from "viem";

const StyledHeader = styled.h1`
  margin: 0;
  margin-bottom: 24px;
  text-align: center;
`;

interface IHeader {
  amount: string;
  asset: string;
}

const Header: React.FC<IHeader> = ({ amount, asset }) => {
  return (
    <StyledHeader>
      Full payment released: {formatEther(amount)} {asset}
    </StyledHeader>
  );
};
export default Header;
