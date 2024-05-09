import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import AttachmentIcon from "svgs/icons/attachment.svg";

const StyledA = styled.a`
  display: flex;
  gap: ${responsiveSize(5, 6)};
  > svg {
    width: 16px;
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

interface IAttachedFile {
  extraDescriptionUri: string;
}

const AttachedFile: React.FC<IAttachedFile> = ({ extraDescriptionUri }) => {
  const href = extraDescriptionUri?.replace(/^ipfs:\/\//, "https://cdn.kleros.link/ipfs/");

  return extraDescriptionUri ? (
    <StyledA href={href} target="_blank" rel="noreferrer">
      <AttachmentIcon />
      View Attached File
    </StyledA>
  ) : null;
};

export default AttachedFile;
