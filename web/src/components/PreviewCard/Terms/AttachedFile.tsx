import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useNewTransactionContext } from "context/NewTransactionContext";
import AttachmentIcon from "svgs/icons/attachment.svg";

const StyledA = styled.a`
  display: flex;
  gap: ${responsiveSize(5, 6)};
  > svg {
    width: 16px;
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const AttachedFile: React.FC = () => {
  const { deliverableFile } = useNewTransactionContext();

  return (
    <StyledA target="_blank" rel="noreferrer">
      <AttachmentIcon />
      {deliverableFile.name}
    </StyledA>
  );
};
export default AttachedFile;
