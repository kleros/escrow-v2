import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import ClosedCaseIcon from "svgs/icons/check-circle-outline.svg";

const useDisputeTimelineItems = (escrowCreateDate: string) => {
  const theme = useTheme();

  return useMemo(() => {
    const formattedDate = getFormattedDate(escrowCreateDate);

    return [
      {
        title: "Sender raised a dispute",
        party: "Arbitration fee paid",
        subtitle: `${formattedDate} - Raised by 0x9812...AB1A`,
        rightSided: true,
        variant: theme.secondaryPurple,
      },
      {
        title: "Receiver paid fee",
        party: "Arbitration fee paid",
        subtitle: `${formattedDate} - 0x1234...BABA deposited the fee`,
        rightSided: true,
        variant: theme.secondaryPurple,
      },
      {
        title: "Disputed",
        party: "Case #2678",
        subtitle: `${formattedDate} - View case on Kleros Court`,
        rightSided: true,
        variant: theme.secondaryPurple,
      },
      {
        title: "Concluded",
        party: "230 DAI paid",
        subtitle: `${formattedDate}`,
        rightSided: true,
        variant: theme.success,
        Icon: ClosedCaseIcon,
      },
    ];
  }, [escrowCreateDate, theme]);
};

export default useDisputeTimelineItems;
