import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import { shortenAddress } from "utils/shortenAddress";
import { resolutionToString } from "utils/resolutionToString";
import ClosedCaseIcon from "svgs/icons/check-circle-outline.svg";

const useDisputeTimelineItems = (
  buyer: string,
  seller: string,
  status: string,
  hasToPayFees: [],
  disputeRequest: [],
  resolvedEvents: []
) => {
  const theme = useTheme();

  return useMemo(() => {
    let timelineItems = [];

    hasToPayFees?.forEach((fee) => {
      const formattedDate = getFormattedDate(new Date(fee.timestamp * 1000));
      let title = fee.party === "2" ? "Buyer paid fee" : "Seller paid fee";
      let party = "Arbitration fee paid";
      timelineItems.push({
        title: title,
        party: party,
        subtitle: `${formattedDate} - Raised by ${fee.party === "2" ? shortenAddress(buyer) : shortenAddress(seller)}`,
        rightSided: true,
        variant: theme.secondaryPurple,
      });
    });

    if (disputeRequest) {
      const formattedDate = getFormattedDate(new Date(disputeRequest.timestamp * 1000));
      timelineItems.push({
        title: `${hasToPayFees[0].party === "2" ? "Seller" : "Buyer"} also paid fee - Dispute Raised`,
        party: `Case #${disputeRequest.id}`,
        subtitle: `${formattedDate} - View case on Kleros Court`,
        rightSided: true,
        variant: theme.secondaryPurple,
      });
    }

    if (status === "TransactionResolved") {
      const resolutionEvent = resolvedEvents?.find((event) => event.resolution);
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
  }, [buyer, seller, status, hasToPayFees, disputeRequest, resolvedEvents, theme]);
};

export default useDisputeTimelineItems;
