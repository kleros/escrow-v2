import React, { useMemo } from "react";
import LightButton from "components/LightButton";
import ArrowIcon from "svgs/icons/arrow.svg";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";

const ViewCaseButton: React.FC = () => {
  const { disputeRequest, resolvedEvents } = useTransactionDetailsContext();
  const buttonText = useMemo(() => {
    if (disputeRequest?.id && resolvedEvents?.length > 0) return "Check how the jury voted on Kleros Court";
    return "Follow the case on Kleros Court";
  }, [disputeRequest, resolvedEvents]);

  const buttonLink = useMemo(() => {
    if (disputeRequest?.id && resolvedEvents?.length > 0)
      return `https://dev--kleros-v2-testnet.netlify.app/#/cases/${disputeRequest.id}/voting`;
    return `https://dev--kleros-v2-testnet.netlify.app/#/cases/${disputeRequest.id}`;
  }, [disputeRequest, resolvedEvents]);

  const handleButtonClick = () => {
    if (disputeRequest?.id) {
      window.open(buttonLink, "_blank");
    }
  };

  return disputeRequest?.id ? (
    <LightButton
      className={clsx(
        "flex flex-row-reverse flex-wrap-reverse gap-2 w-auto pt-0",
        "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-start [&_.button-text]:whitespace-normal"
      )}
      text={buttonText}
      Icon={ArrowIcon}
      onPress={handleButtonClick}
    />
  ) : (
    <Skeleton width={168} height={45} />
  );
};

export default ViewCaseButton;
