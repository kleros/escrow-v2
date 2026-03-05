import React from "react";
import { useEffect, useMemo, useState } from "react";
import { formatETH, formatTokenAmount } from "utils/format";
import { getFormattedDate } from "utils/getFormattedDate";
import { resolutionToString } from "utils/resolutionToString";
import { formatTimeoutDuration } from "utils/formatTimeoutDuration";
import CheckCircleOutlineIcon from "components/StyledIcons/CheckCircleOutlineIcon";
import LawBalanceIcon from "components/StyledIcons/LawBalanceIcon";
import EtherscanIcon from "svgs/icons/etherscan.svg";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN } from "consts/chains";
import { DisputeRequest, HasToPayFee, Payment, SettlementProposal, TransactionResolved } from "src/graphql/graphql";
import Skeleton from "react-loading-skeleton";
import { cn } from "~src/utils";

type Variant = "primaryBlue" | "secondaryBlue" | "warning" | "secondaryPurple" | "success";
const variantToCssVar: Record<Variant, string> = {
  primaryBlue: "--klerosUIComponentsPrimaryBlue",
  secondaryBlue: "--klerosUIComponentsSecondaryBlue",
  warning: "--klerosUIComponentsWarning",
  secondaryPurple: "--klerosUIComponentsSecondaryPurple",
  success: "--klerosUIComponentsSuccess",
};

interface TimelineItem {
  title: React.ReactNode;
  party?: React.ReactNode;
  subtitle: string;
  rightSided: boolean;
  variant: string;
  Icon?: React.ElementType;
}

function calculateTimeLeft(timestamp: number, timeout: number, currentTime: number): number {
  return Math.max(timeout - (currentTime - timestamp), 0);
}

function getThemeColor(variant: Variant): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variantToCssVar[variant]).trim();
}

function getExplorerLink(transactionHash?: string): string | null {
  if (!transactionHash) return null;
  return `${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/tx/${transactionHash}`;
}

function createTimelineItem(
  formattedDate: string,
  title: React.ReactNode,
  party: React.ReactNode,
  variant: Variant,
  transactionHash?: string,
  Icon?: React.ElementType
): TimelineItem {
  const explorerUrl = getExplorerLink(transactionHash);
  const themeColor = getThemeColor(variant);

  return {
    title,
    party: explorerUrl ? (
      <div className={cn("flex items-center", party ? "gap-x-2" : "")}>
        <span className="text-sm" style={{ color: themeColor }}>{party}</span>
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          <EtherscanIcon width={14} height={14} />
        </a>
      </div>
    ) : (
      party
    ),
    subtitle: formattedDate,
    rightSided: true,
    variant: themeColor,
    ...(Icon && { Icon }),
  };
}

const useEscrowTimelineItems = (
  isPreview: boolean,
  transactionCreationTimestamp: number,
  escrowTransactionHash: string,
  status: string,
  assetSymbol: string,
  isNativeTransaction: boolean,
  buyer: string,
  seller: string,
  payments: Payment[],
  settlementProposals: SettlementProposal[],
  hasToPayFees: HasToPayFee[],
  disputeRequest: DisputeRequest | null,
  resolvedEvents: TransactionResolved[],
  feeTimeout: number,
  settlementTimeout: number,
  tokenDecimals?: number
): TimelineItem[] => {
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
    timelineItems.push(createTimelineItem(formattedCreationDate, "Escrow created", "", "primaryBlue", escrowTransactionHash));

    if (!isPreview) {
      payments?.forEach((payment) => {
        const isBuyer = payment.party.toLowerCase() === buyer.toLowerCase();
        const formattedDate = getFormattedDate(new Date(payment.timestamp * 1000));
        const formattedAmount = isNativeTransaction
          ? formatETH(payment.amount)
          : formatTokenAmount(payment.amount, tokenDecimals);
        const title = (
          <>
            The {isBuyer ? "buyer" : "seller"} paid {formattedAmount}{" "}
            {assetSymbol ? assetSymbol : <Skeleton className="z-0" width={30} />}
          </>
        );

        timelineItems.push(createTimelineItem(formattedDate, title, "", "secondaryBlue", payment.transactionHash));
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
          subtitle = `Waiting ${proposal.party === "1" ? "Seller's" : "Buyer's"
            } answer [Timeout: ${formatTimeoutDuration(timeLeft)}]`;
        }

        const formattedAmount = isNativeTransaction
          ? formatETH(proposal.amount)
          : formatTokenAmount(proposal.amount, tokenDecimals);
        const title = (
          <>
            The {proposal.party === "1" ? "buyer" : "seller"} proposed: Pay {formattedAmount}{" "}
            {assetSymbol ? assetSymbol : <Skeleton className="z-0" width={30} />}
          </>
        );
        timelineItems.push(createTimelineItem(formattedDate, title, subtitle, "warning", proposal.transactionHash));
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

        timelineItems.push(createTimelineItem(formattedDate, title, party, "secondaryPurple", fee.transactionHash));
      });

      if (disputeRequest) {
        const formattedDate = getFormattedDate(new Date(disputeRequest.timestamp * 1000));
        timelineItems.push(
          createTimelineItem(
            formattedDate,
            "Dispute created",
            `Case #${disputeRequest.id}`,
            "secondaryPurple",
            disputeRequest.transactionHash,
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
              "success",
              resolutionEvent.transactionHash,
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
    escrowTransactionHash,
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
    isNativeTransaction,
    tokenDecimals,
    buyer,
    seller,
  ]);
};

export default useEscrowTimelineItems;
