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
    deliverableFile ? (
      <StyledA href={`https://ipfs.kleros.io${deliverableFile}`} target="_blank" rel="noreferrer">
        <AttachmentIcon />
        View Attached File
      </StyledA>
    ) : null
  );
};

export default AttachedFile;
