import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@kleros/ui-components-library";
import AttachmentIcon from "svgs/icons/attachment.svg";
import { isContentAddressed, toHttpUrl } from "utils/ipfs";

interface IAttachedFile {
  extraDescriptionUri: string;
}

const attachmentContent = (
  <>
    <AttachmentIcon className="w-4 fill-klerosUIComponentsPrimaryBlue" />
    View Attached File
  </>
);

const AttachedFile: React.FC<IAttachedFile> = ({ extraDescriptionUri }) => {
  const url = toHttpUrl(extraDescriptionUri);

  if (!url) return null;

  //A rejected attachment still indicates that a file was attached,
  //but renders as a disabled, non-clickable link with an explanation.
  if (!isContentAddressed(extraDescriptionUri)) {
    return (
      <Tooltip
        wrapperProps={{ className: "w-fit" }}
        text={`This attachment link was flagged as unsafe and has been disabled: "${url}"`}
      >
        <span className="flex gap-fluid-5-6 cursor-not-allowed opacity-50">{attachmentContent}</span>
      </Tooltip>
    );
  }

  return (
    <Link className="flex gap-fluid-5-6" to={`/attachment/?url=${encodeURIComponent(url)}`}>
      {attachmentContent}
    </Link>
  );
};

export default AttachedFile;
