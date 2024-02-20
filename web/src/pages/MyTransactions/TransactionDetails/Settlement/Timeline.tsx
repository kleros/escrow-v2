import React, { useMemo } from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import { getFormattedDate } from "utils/getFormattedDate";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import HourglassIcon from "components/StyledIcons/HourglassIcon";
import { formatEther } from "viem";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { shortenAddress } from "utils/shortenAddress";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

const Timeline: React.FC = () => {
  const nativeTokenSymbol = useNativeTokenSymbol();
  const { asset, payments, buyer } = useTransactionDetailsContext();

  const items = useMemo(() => {
    return payments?.map((payment) => {
      const formattedDate = getFormattedDate(new Date(payment.timestamp * 1000).toLocaleString());
      const title = `Pay ${formatEther(payment.amount)} ${asset === "native" ? nativeTokenSymbol : asset}`;
      let subtitle = `${formattedDate} - ${shortenAddress(payment.party)} proposed`;
      let Icon = HourglassIcon;
      let variant = "waiting";
      if (payment.status === "refused") {
        variant = "refused";
        Icon = ClosedCircleIcon;
        subtitle += " - Refused";
      } else if (payment.status === "accepted") {
        variant = "accepted";
      }
      return {
        title,
        party: payment.party === buyer ? "Buyer" : "Seller",
        subtitle,
        rightSided: true,
        variant,
        Icon,
      };
    });
  }, [buyer, asset]);

  return items && <StyledTimeline items={items} />;
};

export default Timeline;
