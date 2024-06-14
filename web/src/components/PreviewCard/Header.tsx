import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN } from "consts/chains";
import { isUndefined } from "utils/index";
import { mapStatusToEnum } from "utils/mapStatusToEnum";
import { StyledSkeleton } from "../StyledSkeleton";
import StatusBanner from "../TransactionCard/StatusBanner";
import EtherscanIcon from "svgs/icons/etherscan.svg";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.secondaryPurple};
`;

const StyledHeader = styled.h1`
  margin: 0;
  flex-wrap: wrap;
  word-break: break-word;
  width: 100%;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  ${landscapeStyle(
    () => css`
      flex-shrink: 0;
      gap: 0 ${responsiveSize(24, 32, 900)};
    `
  )}
`;

const StyledEtherscanIcon = styled(EtherscanIcon)`
  display: flex;
  height: 16px;
  width: 16px;
`;

interface IHeader {
  escrowType: string;
  escrowTitle?: string;
  id: string;
  status: string;
  transactionHash: string;
  isCard: boolean;
}

const Header: React.FC<IHeader> = ({ escrowType, escrowTitle, id, status, transactionHash, isCard }) => {
  const currentStatusEnum = mapStatusToEnum(status);
  const etherscanUrl = `${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/tx/${transactionHash}`;

  return (
    <Container>
      <LeftContent>
        <StyledLabel>{escrowType === "general" ? "General Escrow" : "Crypto Swap"}</StyledLabel>
        {isUndefined(escrowTitle) ? <StyledSkeleton /> : <StyledHeader>{escrowTitle}</StyledHeader>}
      </LeftContent>
      <RightContent>
        {transactionHash ? (
          <a href={etherscanUrl} target="_blank" rel="noreferrer">
            <StyledEtherscanIcon />
          </a>
        ) : null}
        <StatusBanner status={currentStatusEnum} isPreview={true} />
      </RightContent>
    </Container>
  );
};

export default Header;
