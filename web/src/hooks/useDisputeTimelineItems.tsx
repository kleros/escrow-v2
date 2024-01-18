import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import { shortenAddress } from "utils/shortenAddress";
import { resolutionToString } from "utils/resolutionToString";
import ClosedCaseIcon from "svgs/icons/check-circle-outline.svg";

const useDisputeTimelineItems = (transactionData) => {
  const theme = useTheme();

  return useMemo(() => {
    let timelineItems = [];

    transactionData?.hasToPayFees?.forEach((fee) => {
      const formattedDate = getFormattedDate(new Date(fee.timestamp * 1000));
      let title = fee.party === "2" ? "Buyer paid fee" : "Seller paid fee";
      let party = "Arbitration fee paid";
      timelineItems.push({
        title: title,
        party: party,
        subtitle: `${formattedDate} - Raised by ${
          fee.party === "2" ? shortenAddress(transactionData?.buyer) : shortenAddress(transactionData?.seller)
        }`,
        rightSided: true,
        variant: theme.secondaryPurple,
      });
    });

    if (transactionData?.disputeRequest) {
      const formattedDate = getFormattedDate(new Date(transactionData.disputeRequest.timestamp * 1000));
      timelineItems.push({
        title: "The other party also paid their fee - Dispute Raised",
        party: `Case #${transactionData.disputeRequest.id}`,
        subtitle: `${formattedDate} - View case on Kleros Court`,
        rightSided: true,
        variant: theme.secondaryPurple,
      });
    }

    if (transactionData?.status === "TransactionResolved") {
      const resolutionEvent = transactionData?.resolvedEvents?.find((event) => event.resolution);
      if (resolutionEvent) {
        const formattedResolutionDate = getFormattedDate(new Date(resolutionEvent.timestamp * 1000));
        timelineItems.push({
          title: "Concluded",
          party: resolutionToString(resolutionEvent?.resolution),
          subtitle: `${formattedResolutionDate}`,
          rightSided: true,
          variant: theme.success,
          Icon: ClosedCaseIcon,
        });
      }
    }

    return timelineItems;
  }, [transactionData, theme]);
};

export default useDisputeTimelineItems;
