import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import { resolutionToString } from "utils/resolutionToString";
import CheckCircleOutlineIcon from "components/StyledIcons/CheckCircleOutlineIcon";
import LawBalanceIcon from "components/StyledIcons/LawBalanceIcon";

const useEscrowTimelineItems = (
  isPreview: boolean,
  transactionCreationTimestamp: number,
  status: string,
  buyer: string,
  seller: string,
  hasToPayFees: [],
  disputeRequest: [],
  resolvedEvents: []
) => {
  const theme = useTheme();

  return useMemo(() => {
    let timelineItems = [];

    const formattedCreationDate = getFormattedDate(new Date(transactionCreationTimestamp * 1000).toLocaleString());
    timelineItems.push({
      title: "Escrow created",
      subtitle: isPreview ? getFormattedDate(new Date().toLocaleString()) : formattedCreationDate,
      rightSided: true,
      variant: theme.primaryBlue,
    });

    if (!isPreview) {
      hasToPayFees?.forEach((fee) => {
        const formattedDate = getFormattedDate(new Date(fee.timestamp * 1000));
        let title = fee.party === "2" ? "The buyer raised a dispute" : "The seller raised a dispute";
        let party = disputeRequest
          ? "Arbitration fees deposited"
          : fee.party === "2"
          ? "Seller's Arbitration fee required [Timeout: 12h 32m TODO]"
          : "Buyer's Arbitration fee required [Timeout: 12h 32m TODO]";

        timelineItems.push({
          title: title,
          party: party,
          subtitle: `${formattedDate}`,
          rightSided: true,
          variant: theme.secondaryPurple,
        });
      });

      if (disputeRequest) {
        const formattedDate = getFormattedDate(new Date(disputeRequest.timestamp * 1000));
        timelineItems.push({
          title: `Dispute created`,
          party: `Case #${disputeRequest.id}`,
          subtitle: `${formattedDate}`,
          rightSided: true,
          variant: theme.secondaryPurple,
          Icon: LawBalanceIcon,
        });
      }

      if (status === "TransactionResolved") {
        const resolutionEvent = resolvedEvents[0];
        if (resolutionEvent) {
          const formattedResolutionDate = getFormattedDate(new Date(resolutionEvent.timestamp * 1000).toLocaleString());
          timelineItems.push({
            title: "Concluded",
            party: resolutionToString(resolutionEvent?.resolution),
            subtitle: `${formattedResolutionDate}`,
            rightSided: true,
            variant: theme.success,
            Icon: CheckCircleOutlineIcon,
          });
        }
      }
    }
    return timelineItems;
  }, [
    transactionCreationTimestamp,
    status,
    resolvedEvents,
    buyer,
    seller,
    hasToPayFees,
    disputeRequest,
    isPreview,
    theme,
  ]);
};

export default useEscrowTimelineItems;
