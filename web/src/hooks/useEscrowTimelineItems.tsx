import { useEffect, useMemo, useState } from "react";
import { DefaultTheme, useTheme } from "styled-components";
import { formatEther } from "viem";
import { getFormattedDate } from "utils/getFormattedDate";
import { resolutionToString } from "utils/resolutionToString";
import { formatTimeoutDuration } from "utils/formatTimeoutDuration";
import CheckCircleOutlineIcon from "components/StyledIcons/CheckCircleOutlineIcon";
import LawBalanceIcon from "components/StyledIcons/LawBalanceIcon";
import { useNativeTokenSymbol } from "./useNativeTokenSymbol";
import { DisputeRequest, HasToPayFee, Payment, SettlementProposal, TransactionResolved } from "src/graphql/graphql";

interface TimelineItem {
  title: string;
  party?: string;
  subtitle: string;
  rightSided: boolean;
  variant: keyof DefaultTheme;
  Icon?: React.ElementType;
}

function calculateTimeLeft(timestamp: number, timeout: number, currentTime: number): number {
  return Math.max(timeout - (currentTime - timestamp), 0);
}

function createTimelineItem(
  formattedDate: string,
  title: string,
  party: string,
  variant: keyof DefaultTheme,
  Icon?: React.ElementType
): TimelineItem {
  return {
    title,
    party,
    subtitle: formattedDate,
    rightSided: true,
    variant,
    ...(Icon && { Icon }),
  };
}

const useEscrowTimelineItems = (
  isPreview: boolean,
  transactionCreationTimestamp: number,
  status: string,
  token: string,
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
  const theme = useTheme();
  const nativeTokenSymbol = useNativeTokenSymbol();
  const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    let timelineItems: TimelineItem[] = [];

    const formattedCreationDate = isPreview
      ? getFormattedDate(new Date())
      : getFormattedDate(new Date(transactionCreationTimestamp * 1000));
    timelineItems.push(createTimelineItem(formattedCreationDate, "Escrow created", "", theme.primaryBlue));

    if (!isPreview) {
      payments?.forEach((payment) => {
        const isBuyer = payment.party.toLowerCase() === buyer.toLowerCase();
        const formattedDate = getFormattedDate(new Date(payment.timestamp * 1000));
        const title = `The ${isBuyer ? "buyer" : "seller"} paid ${formatEther(payment.amount)} ${
          !token ? nativeTokenSymbol : token
        }`;

        timelineItems.push(createTimelineItem(formattedDate, title, "", theme.secondaryBlue));
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

        const title = `The ${proposal.party === "1" ? "buyer" : "seller"} proposed: Pay ${formatEther(
          proposal.amount
        )} ${!token ? nativeTokenSymbol : token}`;
        timelineItems.push(createTimelineItem(formattedDate, title, subtitle, theme.warning));
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

        timelineItems.push(createTimelineItem(formattedDate, title, party, theme.secondaryPurple));
      });

      if (disputeRequest) {
        const formattedDate = getFormattedDate(new Date(disputeRequest.timestamp * 1000));
        timelineItems.push(
          createTimelineItem(
            formattedDate,
            "Dispute created",
            `Case #${disputeRequest.id}`,
            theme.secondaryPurple,
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
              theme.success,
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
    theme,
    token,
    buyer,
    seller,
    nativeTokenSymbol,
  ]);
};

export default useEscrowTimelineItems;
