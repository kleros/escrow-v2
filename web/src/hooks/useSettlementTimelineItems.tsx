import { useMemo } from "react";
import { useTheme } from "styled-components";

const getFormattedDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

const useSettlementTimelineItems = (escrowCreateDate: string) => {
  const theme = useTheme();

  return useMemo(() => {
    const formattedDate = getFormattedDate(escrowCreateDate);

    return [
      {
        title: "Pay 150 DAI",
        party: "Refused",
        subtitle: `${formattedDate} - 0x9812...AB1A proposed`,
        rightSided: true,
        variant: "refused",
      },
      {
        title: "Pay 240 DAI",
        party: "Refused",
        subtitle: `${formattedDate} - 0x1234...BABA proposed`,
        rightSided: true,
        variant: "refused",
      },
      {
        title: "Pay 180 DAI",
        party: "Refused",
        subtitle: `${formattedDate} - 0x9812...AB1A proposed`,
        rightSided: true,
        variant: "refused",
      },
      {
        title: "Pay 230 DAI",
        party: "Waiting response",
        subtitle: `${formattedDate} - 0x1234...BABA proposed`,
        rightSided: true,
        variant: theme.primaryBlue,
      },
    ];
  }, [escrowCreateDate, theme]);
};

export default useSettlementTimelineItems;
