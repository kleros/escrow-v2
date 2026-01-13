import React from "react";
import { Link } from "react-router-dom";
import AttachmentIcon from "svgs/icons/attachment.svg";
import { getIpfsUrl } from "utils/getIpfsUrl";

interface IAttachedFile {
  extraDescriptionUri: string;
}

const AttachedFile: React.FC<IAttachedFile> = ({ extraDescriptionUri }) => {
  const uri = extraDescriptionUri && getIpfsUrl(extraDescriptionUri);

  return extraDescriptionUri ? (
    <Link className="flex gap-fluid-5-6" to={`/attachment/?url=${uri}`}>
      <AttachmentIcon className="w-4 fill-klerosUIComponentsPrimaryBlue" />
      View Attached File
    </Link>
  ) : null;
};

export default AttachedFile;
