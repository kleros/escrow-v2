import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useNavigate, useLocation } from "react-router-dom";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { validateAddress } from "../Terms/Payment/DestinationAddress";
import { EMAIL_REGEX } from "../Terms/Notifications/EmailField";
import { handleFileUpload } from "utils/handleFileUpload";

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
    deliverableFile,
    isFileUploading,
    setIsFileUploading,
    setExtraDescriptionUri,
    setTransactionUri,
    buyerAddress,
    receivingQuantity,
    receivingToken,
    sellerAddress,
    sendingQuantity,
    sendingToken,
    deadline,
    notificationEmail,
    hasSufficientNativeBalance,
    isRecipientAddressResolved,
  } = useNewTransactionContext();

  const isBuyerAddressValid = validateAddress(buyerAddress);
  const areReceivingFieldsEmpty = !receivingQuantity || !receivingToken || !buyerAddress;

  const isSellerAddressValid = validateAddress(sellerAddress);
  const areSendingFieldsEmpty =
    escrowType === "swap"
      ? !sendingQuantity || !sendingToken || !sellerAddress
      : !sendingQuantity || !sellerAddress;

  const isEmailValid = notificationEmail === "" || EMAIL_REGEX.test(notificationEmail);

  const isDeliverableValid =
    escrowType === "general"
      ? !!deliverableText && !isFileUploading
      : !(areReceivingFieldsEmpty || !isBuyerAddressValid);

  const deadlineTimestamp = deadline ? new Date(deadline).getTime() : 0;
  const currentTime = Date.now();
  const isDeadlineInPast = deadlineTimestamp <= currentTime;

  const isButtonDisabled =
    escrowType === "swap" ||
    (location.pathname.includes("/newTransaction/title") && !escrowTitle) ||
    (location.pathname.includes("/newTransaction/deliverable") && !isDeliverableValid) ||
    (location.pathname.includes("/newTransaction/payment") &&
      (areSendingFieldsEmpty ||
        !isSellerAddressValid ||
        !isRecipientAddressResolved ||
        !hasSufficientNativeBalance)) ||
    (location.pathname.includes("/newTransaction/deadline") && (!deadline || isDeadlineInPast)) ||
    (location.pathname.includes("/newTransaction/notifications") && !isEmailValid);

  const handleNextClick = async () => {
    try {
      if (location.pathname.includes("/newTransaction/deliverable") && escrowType === "general") {
        const transactionUri = await handleFileUpload(
          escrowTitle,
          deliverableText,
          setIsFileUploading,
          setExtraDescriptionUri,
          deliverableFile
        );

        if (transactionUri) {
          setTransactionUri(transactionUri);
          navigate(nextRoute);
        }
      } else {
        navigate(nextRoute);
      }
    } catch (error) {
      console.error("Error in upload process:", error);
    }
  };

  return <Button disabled={isButtonDisabled} onClick={handleNextClick} text="Next" />;
};

export default NextButton;
