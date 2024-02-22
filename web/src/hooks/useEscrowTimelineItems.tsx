import { useMemo } from "react";
import { useTheme } from "styled-components";
import { getFormattedDate } from "utils/getFormattedDate";
import { resolutionToString } from "utils/resolutionToString";
import CheckCircleOutlineIcon from "components/StyledIcons/CheckCircleOutlineIcon";
import LawBalanceIcon from "components/StyledIcons/LawBalanceIcon";
import { formatEther } from "viem";
import { useNativeTokenSymbol } from "./useNativeTokenSymbol";

const useEscrowTimelineItems = (
  isPreview: boolean,
  transactionCreationTimestamp: number,
  status: string,
  asset: string,
  buyer: string,
  seller: string,
  payments: [],
  settlementProposals: [],
  hasToPayFees: [],
  disputeRequest: [],
  resolvedEvents: []
) => {
  const theme = useTheme();
  const nativeTokenSymbol = useNativeTokenSymbol();

  return useMemo(() => {
    let timelineItems = [];

    const formattedCreationDate = getFormattedDate(new Date(transactionCreationTimestamp * 1000).toLocaleString());
    timelineItems.push({
      title: "Escrow created",
      subtitle: isPreview ? getFormattedDate(new Date().toLocaleString()) : formattedCreationDate,
      rightSided: true,
      variant: theme.primaryBlue,
    });

    if (!isPreview) {
      payments?.map((payment) => {
        const isBuyer = payment.party.toLowerCase() === buyer;
        const formattedDate = getFormattedDate(new Date(payment.timestamp * 1000).toLocaleString());
        const title = `The ${isBuyer ? "buyer" : "seller"} paid ${formatEther(payment.amount)} ${
          asset === "native" ? nativeTokenSymbol : asset
        } to ${isBuyer ? "Seller" : "Buyer"}`;

        timelineItems.push({
          title,
          subtitle: `${formattedDate}`,
          rightSided: true,
          variant: theme.secondaryBlue,
        });
      });

      settlementProposals?.forEach((proposal, index) => {
        const formattedDate = getFormattedDate(new Date(proposal.timestamp * 1000).toLocaleString());
        let subtitle;

        const isLatestProposal = index === settlementProposals.length - 1;
        const hasBeenAccepted =
          isLatestProposal &&
          hasToPayFees.length === 0 &&
          status !== "WaitingSettlementSeller" &&
          status !== "WaitingSettlementBuyer";

        if (hasBeenAccepted) {
          subtitle = "Proposal accepted";
        } else if (hasToPayFees.length > 0 || !isLatestProposal) {
          subtitle = "Proposal refused";
        } else {
          subtitle = proposal.party === "1" ? "Waiting Seller's answer" : "Waiting Buyer's answer";
        }

        let title = `The ${proposal.party === "1" ? "buyer" : "seller"} proposed: Pay ${formatEther(proposal.amount)} ${
          asset === "native" ? nativeTokenSymbol : asset
        }`;

        timelineItems.push({
          title,
          subtitle: `${formattedDate}`,
          party: subtitle,
          rightSided: true,
          variant: theme.warning,
        });
      });

      hasToPayFees?.forEach((fee) => {
        const formattedDate = getFormattedDate(new Date(fee.timestamp * 1000));
        let title = fee.party === "2" ? "The buyer raised a dispute" : "The seller raised a dispute";
        let party = disputeRequest
          ? "Arbitration fees deposited"
          : fee.party === "2"
          ? "Seller's Arbitration fee required [Timeout: 12h 32m TODO]"
          : "Buyer's Arbitration fee required [Timeout: 12h 32m TODO]";

        timelineItems.push({
          title: title,
          party: party,
          subtitle: `${formattedDate}`,
          rightSided: true,
          variant: theme.secondaryPurple,
        });
      });

      if (disputeRequest) {
        const formattedDate = getFormattedDate(new Date(disputeRequest.timestamp * 1000));
        timelineItems.push({
          title: `Dispute created`,
          party: `Case #${disputeRequest.id}`,
          subtitle: `${formattedDate}`,
          rightSided: true,
          variant: theme.secondaryPurple,
          Icon: LawBalanceIcon,
        });
      }

      if (status === "TransactionResolved") {
        const resolutionEvent = resolvedEvents[0];
        if (resolutionEvent) {
          const formattedResolutionDate = getFormattedDate(new Date(resolutionEvent.timestamp * 1000).toLocaleString());
          timelineItems.push({
            title: "Concluded",
            party: resolutionToString(resolutionEvent?.resolution),
            subtitle: `${formattedResolutionDate}`,
            rightSided: true,
            variant: theme.success,
            Icon: CheckCircleOutlineIcon,
          });
        }
      }
    }
    return timelineItems;
  }, [
    transactionCreationTimestamp,
    status,
    resolvedEvents,
    buyer,
    seller,
    hasToPayFees,
    disputeRequest,
    settlementProposals,
    isPreview,
    theme,
  ]);
};

export default useEscrowTimelineItems;
