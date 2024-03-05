import React from "react";
import styled from "styled-components";
import { isUndefined } from "utils/index";
import { mapStatusToEnum } from "utils/mapStatusToEnum";
import { StyledSkeleton } from "../StyledSkeleton";
import StatusBanner from "../TransactionCard/StatusBanner";

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

interface IHeader {
  escrowType: string;
  escrowTitle?: string;
  id: string;
  status: string;
  isCard: boolean;
}

const Header: React.FC<IHeader> = ({ escrowType, escrowTitle, id, status, isCard }) => {
  const currentStatusEnum = mapStatusToEnum(status);

  return (
    <Container>
      <LeftContent>
        <StyledLabel>{escrowType === "general" ? "General Escrow" : "Crypto Swap"}</StyledLabel>
        {isUndefined(escrowTitle) ? <StyledSkeleton /> : <StyledHeader>{escrowTitle}</StyledHeader>}
      </LeftContent>
      <StatusBanner status={currentStatusEnum} isPreview={true} />
    </Container>
  );
};

export default Header;
