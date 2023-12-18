import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import HourglassIcon from "components/StyledIcons/HourglassIcon";

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
        Icon: ClosedCircleIcon,
      },
      {
        title: "Pay 240 DAI",
        party: "Refused",
        subtitle: `${formattedDate} - 0x1234...BABA proposed`,
        rightSided: true,
        variant: "refused",
        Icon: ClosedCircleIcon,
      },
      {
        title: "Pay 180 DAI",
        party: "Refused",
        subtitle: `${formattedDate} - 0x9812...AB1A proposed`,
        rightSided: true,
        variant: "refused",
        Icon: ClosedCircleIcon,
      },
      {
        title: "Pay 230 DAI",
        party: "Waiting response",
        subtitle: `${formattedDate} - 0x1234...BABA proposed`,
        rightSided: true,
        Icon: HourglassIcon,
      },
    ];
  }, [escrowCreateDate, theme]);
};

export default useSettlementTimelineItems;
