import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useNavigate, useLocation } from "react-router-dom";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { validateAddress } from "../Terms/TokenTransaction/DestinationAddress";
import { EMAIL_REGEX } from "../Terms/Notifications/EmailField";

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    escrowType,
    escrowTitle,
    deliverableText,
    receivingRecipientAddress,
    receivingQuantity,
    receivingToken,
    sendingRecipientAddress,
    sendingQuantity,
    sendingToken,
    deadline,
    notificationEmail,
  } = useNewTransactionContext();

  const isReceivingAddressValid = validateAddress(receivingRecipientAddress);
  const areReceivingFieldsEmpty = !receivingQuantity || !receivingToken || !receivingRecipientAddress;

  const isSendingAddressValid = validateAddress(sendingRecipientAddress);
  const areSendingFieldsEmpty = !sendingQuantity || !sendingToken || !sendingRecipientAddress;

  const isEmailValid = notificationEmail === "" || EMAIL_REGEX.test(notificationEmail);

  const isDeliverableValid =
    escrowType === "general" ? !!deliverableText : !(areReceivingFieldsEmpty || !isReceivingAddressValid);

  const isButtonDisabled =
    (location.pathname.includes("/newTransaction/title") && !escrowTitle) ||
    (location.pathname.includes("/newTransaction/deliverable") && !isDeliverableValid) ||
    (location.pathname.includes("/newTransaction/payment") && (areSendingFieldsEmpty || !isSendingAddressValid)) ||
    (location.pathname.includes("/newTransaction/deadline") && !deadline) ||
    (location.pathname.includes("/newTransaction/notifications") && !isEmailValid);

  return <Button disabled={isButtonDisabled} onClick={() => navigate(nextRoute)} text="Next" />;
};

export default NextButton;
