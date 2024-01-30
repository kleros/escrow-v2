import React, { useMemo } from "react";
import styled from "styled-components";
import { SkeletonButton } from "components/StyledSkeleton";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import ArrowIcon from "assets/svgs/icons/arrow.svg";
import LightButton from "src/components/LightButton";

const StyledButton = styled(LightButton)`
  display: flex;
  width: auto;
  gap: 8px;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  > .button-text {
    color: ${({ theme }) => theme.primaryBlue};
    white-space: normal;
    text-align: start;
  }
  padding-top: 0px;
`;

const ViewCaseButton: React.FC = () => {
  const { disputeRequest, resolvedEvents } = useTransactionDetailsContext();
  console.log(disputeRequest, resolvedEvents);

  const buttonText = useMemo(() => {
    if (disputeRequest?.id && resolvedEvents?.length > 0) return "Check how the jury voted on Kleros Court";
    return "Follow the case on Kleros Court";
  }, [disputeRequest, resolvedEvents]);

  const buttonLink = useMemo(() => {
    if (disputeRequest?.id && resolvedEvents?.length > 0)
      return `https://dev--kleros-v2.netlify.app/#/cases/${disputeRequest.id}/voting`;
    return `https://dev--kleros-v2.netlify.app/#/cases/${disputeRequest.id}`;
  }, [disputeRequest, resolvedEvents]);

  const handleButtonClick = () => {
    if (disputeRequest?.id) {
      window.open(buttonLink, "_blank");
    }
  };

  return disputeRequest?.id ? (
    <StyledButton text={buttonText} Icon={ArrowIcon} className="reverse-button" onClick={handleButtonClick} />
  ) : (
    <SkeletonButton />
  );
};

export default ViewCaseButton;
