import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import CheckCircleOutlineIcon from "components/StyledIcons/CheckCircleOutlineIcon";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { resolutionToString } from "utils/resolutionToString";

const useEscrowTimelineItems = (transactionData: TransactionDetailsFragment, isPreview: boolean) => {
  const theme = useTheme();

  return useMemo(() => {
    let timelineItems = [];

    const formattedCreationDate = getFormattedDate(new Date(transactionData?.timestamp * 1000).toLocaleString());
    timelineItems.push({
      title: "Escrow created",
      party: "In Progress",
      subtitle: isPreview ? getFormattedDate(new Date().toLocaleString()) : formattedCreationDate,
      rightSided: true,
      variant: theme.primaryBlue,
    });

    if (transactionData?.status === "TransactionResolved") {
      const resolutionEvent = transactionData?.resolvedEvents[0];
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

    return timelineItems;
  }, [transactionData, theme]);
};

export default useEscrowTimelineItems;
