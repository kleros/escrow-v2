import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import CheckCircleOutlineIcon from "components/StyledIcons/CheckCircleOutlineIcon";
import { resolutionToString } from "utils/resolutionToString";

const useEscrowTimelineItems = (isPreview: boolean, timestamp: number, status: string, resolvedEvents: []) => {
  const theme = useTheme();

  return useMemo(() => {
    let timelineItems = [];

    const formattedCreationDate = getFormattedDate(new Date(timestamp * 1000).toLocaleString());
    timelineItems.push({
      title: "Escrow created",
      party: "In Progress",
      subtitle: isPreview ? getFormattedDate(new Date().toLocaleString()) : formattedCreationDate,
      rightSided: true,
      variant: theme.primaryBlue,
    });

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

    return timelineItems;
  }, [timestamp, status, resolvedEvents, theme]);
};

export default useEscrowTimelineItems;
