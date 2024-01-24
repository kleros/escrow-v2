import React from "react";
import { Button } from "@kleros/ui-components-library";
import { SkeletonButton } from "components/StyledSkeleton";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const ViewCaseButton: React.FC = () => {
  const { disputeRequest } = useTransactionDetailsContext();

  const handleButtonClick = () => {
    if (disputeRequest?.id) {
      window.open(`https://dev--kleros-v2.netlify.app/#/cases/${disputeRequest.id}`, "_blank");
    }
  };

  return disputeRequest?.id ? (
    <Button text={`View Case #${disputeRequest.id}`} onClick={handleButtonClick} />
  ) : (
    <SkeletonButton />
  );
};

export default ViewCaseButton;
