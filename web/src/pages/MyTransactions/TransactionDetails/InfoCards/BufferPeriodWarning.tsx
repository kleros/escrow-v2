import React, { useEffect, useState, useMemo } from "react";
import { AlertMessage } from "@kleros/ui-components-library";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { formatTimeoutDuration } from "utils/formatTimeoutDuration";

interface Props {
  disputeDeadlineMs: number;
  deliveryDeadlineMs: number;
}

const BufferPeriodWarning: React.FC<Props> = ({ disputeDeadlineMs, deliveryDeadlineMs }) => {
  const nowMs = Date.now();
  const [now, setNow] = useState(nowMs);
  const { address } = useAccount();
  const { buyer, seller, status } = useTransactionDetailsContext();

  const hidePermanently = status !== "NoDispute";

  useEffect(() => {
    if (hidePermanently) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [hidePermanently]);

  const inBuffer = !hidePermanently && now > deliveryDeadlineMs && now < disputeDeadlineMs;
  const secondsLeft = useMemo(
    () => Math.max(0, Math.floor((disputeDeadlineMs - now) / 1000)),
    [disputeDeadlineMs, now]
  );

  if (!inBuffer) return null;

  const isBuyerConnected = address?.toLowerCase() === buyer;
  const isSellerConnected = address?.toLowerCase() === seller;

  const msgBuyer = `You have ${formatTimeoutDuration(secondsLeft)} to release the payment, reach a settlement, or raise a dispute.`;
  const msgSeller = `You have ${formatTimeoutDuration(secondsLeft)} to reach a settlement or raise a dispute.`;
  const msgGeneric = `There is ${formatTimeoutDuration(secondsLeft)} to either reach a settlement with the other party or raise a dispute.`;

  const message = isBuyerConnected ? msgBuyer : isSellerConnected ? msgSeller : msgGeneric;

  return <AlertMessage variant="warning" title="Delivery deadline is over" msg={message} />;
};

export default BufferPeriodWarning;