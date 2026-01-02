import React from "react";
import { useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { getFormattedDate } from "utils/getFormattedDate";
import { resolutionToString } from "utils/resolutionToString";
import { formatTimeoutDuration } from "utils/formatTimeoutDuration";
import CheckCircleOutlineIcon from "components/StyledIcons/CheckCircleOutlineIcon";
import LawBalanceIcon from "components/StyledIcons/LawBalanceIcon";
import { DisputeRequest, HasToPayFee, Payment, SettlementProposal, TransactionResolved } from "src/graphql/graphql";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "./useToggleThemeContext";

type Variant = "primaryBlue" | "secondaryBlue" | "warning" | "secondaryPurple" | "success";

interface TimelineItem {
  title: string;
  party?: string;
  subtitle: string;
  rightSided: boolean;
  variant: string;
  Icon?: React.ElementType;
}

function calculateTimeLeft(timestamp: number, timeout: number, currentTime: number): number {
  return Math.max(timeout - (currentTime - timestamp), 0);
}

function mapVariantToThemeColor(isLightTheme: boolean, variant: Variant): string {
  switch (variant) {
    case "primaryBlue":
      return isLightTheme ? "#009aff" : "#6cc5ff";
    case "secondaryBlue":
      return isLightTheme ? "#7bcbff" : "#a5dbff";
    case "warning":
      return isLightTheme ? "#ff9900" : "#ffc46b";
    case "secondaryPurple":
      return isLightTheme ? "#9013fe" : "#b45fff";
    case "success":
      return isLightTheme ? "#00c42b" : "#65dc7f";
  }
}

function createTimelineItem(
  formattedDate: string,
  title: string,
  party: string,
  isLightTheme: boolean,
  variant: Variant,
  Icon?: React.ElementType
): TimelineItem {
  return {
    title,
    party,
    subtitle: formattedDate,
    rightSided: true,
    variant: mapVariantToThemeColor(isLightTheme, variant),
    ...(Icon && { Icon }),
  };
}

const useEscrowTimelineItems = (
  isPreview: boolean,
  transactionCreationTimestamp: number,
  status: string,
  assetSymbol: string,
  buyer: string,
  seller: string,
  payments: Payment[],
  settlementProposals: SettlementProposal[],
  hasToPayFees: HasToPayFee[],
  disputeRequest: DisputeRequest | null,
  resolvedEvents: TransactionResolved[],
  feeTimeout: number,
  settlementTimeout: number
): TimelineItem[] => {
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [theme] = useTheme();
  const isLightTheme = theme === "light";

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    let timelineItems: TimelineItem[] = [];

    const formattedCreationDate = isPreview
      ? getFormattedDate(new Date())
      : getFormattedDate(new Date(transactionCreationTimestamp * 1000));
    timelineItems.push(createTimelineItem(formattedCreationDate, "Escrow created", "", isLightTheme, "primaryBlue"));

    if (!isPreview) {
      payments?.forEach((payment) => {
        const isBuyer = payment.party.toLowerCase() === buyer.toLowerCase();
        const formattedDate = getFormattedDate(new Date(payment.timestamp * 1000));
        const title = (
          <>
            The {isBuyer ? "buyer" : "seller"} paid {formatEther(payment.amount)}{" "}
            {assetSymbol ? assetSymbol : <Skeleton className="z-0" width={30} />}
          </>
        );

        timelineItems.push(createTimelineItem(formattedDate, title, "", isLightTheme, "secondaryBlue"));
      });

      settlementProposals?.forEach((proposal, index) => {
        const formattedDate = getFormattedDate(new Date(proposal.timestamp * 1000));
        let subtitle;
        const isLatestProposal = index === settlementProposals.length - 1;
        const timeLeft = calculateTimeLeft(proposal.timestamp, settlementTimeout, currentTime);

        if (
          isLatestProposal &&
          hasToPayFees.length === 0 &&
          status !== "WaitingSettlementSeller" &&
          status !== "WaitingSettlementBuyer"
        ) {
          subtitle = "Proposal accepted";
        } else if (hasToPayFees.length > 0 || !isLatestProposal) {
          subtitle = "Proposal refused";
        } else {
          subtitle = `Waiting ${
            proposal.party === "1" ? "Seller's" : "Buyer's"
          } answer [Timeout: ${formatTimeoutDuration(timeLeft)}]`;
        }

        const title = (
          <>
            The {proposal.party === "1" ? "buyer" : "seller"} proposed: Pay {formatEther(proposal.amount)}{" "}
            {assetSymbol ? assetSymbol : <Skeleton className="z-0" width={30} />}
          </>
        );
        timelineItems.push(createTimelineItem(formattedDate, title, subtitle, isLightTheme, "warning"));
      });

      hasToPayFees?.forEach((fee) => {
        const timeLeft = calculateTimeLeft(fee.timestamp, feeTimeout, currentTime);
        const formattedDate = getFormattedDate(new Date(fee.timestamp * 1000));
        const title = `The ${fee.party === "2" ? "buyer" : "seller"} raised a dispute`;
        let timeoutCountdownMessage =
          timeLeft > 0
            ? `'s ` + `Arbitration fee required [Timeout: ${formatTimeoutDuration(timeLeft)}]`
            : " failed to deposit the arbitration fee";
        let party = disputeRequest
          ? "Arbitration fees deposited"
          : `${fee.party === "2" ? "Seller" : "Buyer"}${timeoutCountdownMessage}`;

        timelineItems.push(createTimelineItem(formattedDate, title, party, isLightTheme, "secondaryPurple"));
      });

      if (disputeRequest) {
        const formattedDate = getFormattedDate(new Date(disputeRequest.timestamp * 1000));
        timelineItems.push(
          createTimelineItem(
            formattedDate,
            "Dispute created",
            `Case #${disputeRequest.id}`,
            isLightTheme,
            "secondaryPurple",
            LawBalanceIcon
          )
        );
      }

      if (status === "TransactionResolved") {
        const resolutionEvent = resolvedEvents?.[resolvedEvents.length - 1];
        if (resolutionEvent) {
          const formattedDate = getFormattedDate(new Date(resolutionEvent.timestamp * 1000));
          timelineItems.push(
            createTimelineItem(
              formattedDate,
              "Concluded",
              resolutionToString(resolutionEvent.resolution),
              isLightTheme,
              "success",
              CheckCircleOutlineIcon
            )
          );
        }
      }
    }

    return timelineItems;
  }, [
    isPreview,
    transactionCreationTimestamp,
    status,
    payments,
    settlementProposals,
    hasToPayFees,
    disputeRequest,
    resolvedEvents,
    feeTimeout,
    settlementTimeout,
    currentTime,
    assetSymbol,
    buyer,
    seller,
  ]);
};

export default useEscrowTimelineItems;
