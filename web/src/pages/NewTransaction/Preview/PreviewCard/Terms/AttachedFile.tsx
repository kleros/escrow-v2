import React from "react";
import styled from "styled-components";
import { useNewTransactionContext } from "context/NewTransactionContext";
import AttachmentIcon from "svgs/icons/attachment.svg";

const StyledA = styled.a`
  display: flex;
  gap: calc(5px + (6 - 5) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  > svg {
    width: 16px;
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const AttachedFile: React.FC = () => {
  const { deliverableFile } = useNewTransactionContext();

  console.log(deliverableFile);

  return (
    <StyledA target="_blank" rel="noreferrer">
      <AttachmentIcon />
      {deliverableFile.name}
    </StyledA>
  );
};
export default AttachedFile;
