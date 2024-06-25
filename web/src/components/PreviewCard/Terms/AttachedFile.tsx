import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import AttachmentIcon from "svgs/icons/attachment.svg";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { getIpfsUrl } from "utils/getIpfsUrl";

const StyledA = styled(Link)`
  height: fit-content;
  display: flex;
  gap: ${responsiveSize(5, 6)};
  ${landscapeStyle(
    () => css`
      > svg {
        width: 16px;
        fill: ${({ theme }) => theme.primaryBlue};
      }
    `
  )}
`;

interface IAttachedFile {
  extraDescriptionUri: string;
}

const AttachedFile: React.FC<IAttachedFile> = ({ extraDescriptionUri }) => {
  const uri = extraDescriptionUri && getIpfsUrl(extraDescriptionUri);

  return extraDescriptionUri ? (
    <StyledA to={`/attachment/?url=${uri}`}>
      <AttachmentIcon />
      View Attached File
    </StyledA>
  ) : null;
};

export default AttachedFile;
