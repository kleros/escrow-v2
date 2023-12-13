import { useMemo } from "react";
import { useTheme } from "styled-components";

const getFormattedDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

const useItems = (escrowCreateDate: string) => {
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

export default useItems;
