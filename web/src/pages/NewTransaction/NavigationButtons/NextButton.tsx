import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useNavigate, useLocation } from "react-router-dom";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { validateAddress } from "../Terms/Payment/DestinationAddress";
import { EMAIL_REGEX } from "../Terms/Notifications/EmailField";

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { escrowTitle, deliverableText, paymentRecipientAddress, paymentQuantity, paymentToken, notificationEmail } =
    useNewTransactionContext();

  const isAddressValid = validateAddress(paymentRecipientAddress);
  const arePaymentFieldsEmpty = !paymentQuantity || !paymentToken || !paymentRecipientAddress;
  const isEmailValid = notificationEmail === "" || EMAIL_REGEX.test(notificationEmail);

  const isButtonDisabled =
    (location.pathname.includes("/newTransaction/title") && !escrowTitle) ||
    (location.pathname.includes("/newTransaction/deliverable") && !deliverableText) ||
    (location.pathname.includes("/newTransaction/payment") && (arePaymentFieldsEmpty || !isAddressValid)) ||
    (location.pathname.includes("/newTransaction/notifications") && !isEmailValid);

  return <Button disabled={isButtonDisabled} onClick={() => navigate(nextRoute)} text="Next" />;
};

export default NextButton;
