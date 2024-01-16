import React, { useMemo } from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { getFormattedDate } from "utils/getFormattedDate";
import ClosedCircleIcon from "components/StyledIcons/ClosedCircleIcon";
import HourglassIcon from "components/StyledIcons/HourglassIcon";
import { formatEther } from "viem";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { shortenAddress } from "utils/shortenAddress";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface ITimeline {
  transactionData: TransactionDetailsFragment;
}

const Timeline: React.FC<ITimeline> = ({ transactionData }) => {
  const nativeTokenSymbol = useNativeTokenSymbol();
  console.log("transactionData", transactionData);
  console.log("timestamp", transactionData?.timestamp);
  const items = useMemo(() => {
    return transactionData?.payments?.map((payment) => {
      console.log(new Date(payment.timestamp));
      const formattedDate = getFormattedDate(new Date(payment.timestamp * 1000).toLocaleString());
      const title = `Pay ${formatEther(payment.amount)} ${
        transactionData?.asset === "native" ? nativeTokenSymbol : transactionData?.asset
      }`;
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
        party: payment.party === transactionData.buyer ? "Buyer" : "Seller",
        subtitle,
        rightSided: true,
        variant,
        Icon,
      };
    });
  }, [transactionData]);

  return items && <StyledTimeline items={items} />;
};

export default Timeline;
