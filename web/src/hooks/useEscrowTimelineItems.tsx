import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";

const useEscrowTimelineItems = (escrowCreateDate: string) => {
  const theme = useTheme();

  return useMemo(() => {
    const formattedDate = getFormattedDate(escrowCreateDate);

    return [
      {
        title: "Escrow Created",
        party: "In Progress",
        subtitle: formattedDate,
        rightSided: true,
        variant: theme.primaryBlue,
      },
    ];
  }, [escrowCreateDate, theme]);
};

export default useEscrowTimelineItems;
