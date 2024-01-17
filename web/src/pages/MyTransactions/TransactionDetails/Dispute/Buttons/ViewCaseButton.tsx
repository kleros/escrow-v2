import React from "react";
import { Button } from "@kleros/ui-components-library";
import { SkeletonButton } from "components/StyledSkeleton";
import { isUndefined } from "utils/index";

interface IViewCaseButton {
  disputeID: string;
}

const ViewCaseButton: React.FC<IViewCaseButton> = ({ disputeID }) => {
  const handleButtonClick = () => {
    window.open(`https://dev--kleros-v2.netlify.app/#/cases/${disputeID}`, "_blank");
  };

  return !isUndefined(disputeID) ? (
    <Button text={`View Case #${disputeID}`} onClick={handleButtonClick} />
  ) : (
    <SkeletonButton />
  );
};

export default ViewCaseButton;
