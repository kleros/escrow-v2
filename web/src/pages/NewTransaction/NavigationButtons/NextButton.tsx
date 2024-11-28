import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useNavigate, useLocation } from "react-router-dom";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { handleFileUpload } from "utils/handleFileUpload";
import { validateAddress } from "utils/validateAddress";
import { useAccount } from "wagmi";
import { EMAIL_REGEX } from "src/consts";
import { isEmpty, isUndefined } from "src/utils";
import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const { address } = useAccount();
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

  const { user, userExists, updateEmail, addUser, isAddingUser, isUpdatingUser, uploadFile } = useAtlasProvider();

  const isEmailUpdateable = user?.email
    ? !isUndefined(user?.emailUpdateableAt) && new Date(user.emailUpdateableAt!).getTime() < new Date().getTime()
    : true;

  const isBuyerAddressValid = validateAddress(buyerAddress);
  const areReceivingFieldsEmpty = !receivingQuantity || !receivingToken || !buyerAddress;

  const isSellerAddressValid = validateAddress(sellerAddress);
  const areSendingFieldsEmpty =
    escrowType === "swap" ? !sendingQuantity || !sendingToken || !sellerAddress : !sendingQuantity || !sellerAddress;

  const isEmailValid = isEmpty(notificationEmail) || EMAIL_REGEX.test(notificationEmail);

  const isDeliverableValid =
    escrowType === "general"
      ? !!deliverableText && !isFileUploading
      : !(areReceivingFieldsEmpty || !isBuyerAddressValid);

  const deadlineTimestamp = deadline ? new Date(deadline).getTime() : 0;
  const currentTime = Date.now();
  const isDeadlineInPast = deadlineTimestamp <= currentTime;

  const isButtonDisabled =
    escrowType === "swap" ||
    (location.pathname.includes("/new-transaction/title") && !escrowTitle) ||
    (location.pathname.includes("/new-transaction/deliverable") && !isDeliverableValid) ||
    (location.pathname.includes("/new-transaction/payment") &&
      (areSendingFieldsEmpty || !isSellerAddressValid || !isRecipientAddressResolved || !hasSufficientNativeBalance)) ||
    (location.pathname.includes("/new-transaction/deadline") && (!deadline || isDeadlineInPast)) ||
    (location.pathname.includes("/new-transaction/notifications") &&
      (!isEmailValid || isAddingUser || isUpdatingUser || !user));

  const handleNextClick = async () => {
    if (location.pathname.includes("/new-transaction/deliverable") && escrowType === "general") {
      const transactionUri = await handleFileUpload(
        uploadFile,
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
    } else if (
      location.pathname.includes("/new-transaction/notifications") &&
      !isUndefined(address) &&
      user &&
      ![user.email, ""].includes(notificationEmail)
    ) {
      // if user exists then update email
      if (userExists) {
        if (!isEmailUpdateable) {
          navigate(nextRoute);
          return;
        }
        const data = {
          newEmail: notificationEmail,
        };
        infoToast("Updating email ...");
        updateEmail(data)
          .then(async (res) => {
            if (res) {
              successToast("Email updated successfully!");
              navigate(nextRoute);
            }
          })
          .catch((err) => {
            console.log(err);
            errorToast(`Updating email failed: ${err?.message}`);
          });
      } else {
        const data = {
          email: notificationEmail,
        };
        infoToast("Adding user ...");
        addUser(data)
          .then(async (res) => {
            if (res) {
              successToast("User added successfully!");
              navigate(nextRoute);
            }
          })
          .catch((err) => {
            console.log(err);
            errorToast(`Adding user failed: ${err?.message}`);
          });
      }
    } else {
      navigate(nextRoute);
    }
  };

  return (
    <Button
      disabled={isButtonDisabled}
      onClick={handleNextClick}
      text={escrowType === "general" ? "Next" : "Coming Soon"}
    />
  );
};

export default NextButton;
