import React, { useCallback, useEffect, useState } from "react";

import { useAccount } from "wagmi";

import { AlertMessage, Button } from "@kleros/ui-components-library";

import { EMAIL_REGEX } from "consts/index";

import { ISettings } from "../../../../index";

import FormContact from "./FormContact";
import { isUndefined } from "src/utils";
import { timeLeftUntil } from "utils/date";
import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import InfoCard from "components/InfoCard";
import EmailVerificationInfo from "./EmailVerificationInfo";

const unsubscribeButtonsStyle =
  "!bg-klerosUIComponentsError !border-klerosUIComponentsError hover:!bg-klerosUIComponentsError hover:opacity-75 [&_.button-text]:!text-white";

const FormContactDetails: React.FC<ISettings> = ({ toggleIsSettingsOpen }) => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [isConfirmingUnsubscribe, setIsConfirmingUnsubscribe] = useState(false);
  const { address } = useAccount();
  const {
    user,
    userExists,
    isAddingUser,
    isFetchingUser,
    isUpdatingUser,
    isDeletingUser,
    addUser,
    updateEmail,
    deleteUser,
  } = useAtlasProvider();

  const isEditingEmail = user?.email !== emailInput;
  const emailIsValid = EMAIL_REGEX.test(emailInput);

  const isEmailUpdateable = user?.email
    ? !isUndefined(user?.emailUpdateableAt) && new Date(user.emailUpdateableAt!).getTime() < new Date().getTime()
    : true;

  const isSaveDisabled =
    !isEditingEmail ||
    !emailIsValid ||
    isAddingUser ||
    isFetchingUser ||
    isUpdatingUser ||
    isDeletingUser ||
    !isEmailUpdateable;

  useEffect(() => {
    if (!user || !userExists) return;

    setEmailInput(user.email);
  }, [user, userExists]);

  const handleConfirmUnsubscribe = useCallback(async () => {
    if (isUndefined(address)) return;

    infoToast("Unsubscribing ...");
    deleteUser()
      .then((res) => {
        if (!res) {
          errorToast("Unsubscribe failed: Unknown error");
          return;
        }
        setEmailInput("");
        setIsConfirmingUnsubscribe(false);
        successToast("You have been unsubscribed from notifications.");
        toggleIsSettingsOpen();
      })
      .catch((err) => {
        console.error("Unsubscribe failed:", err);
        errorToast(`Unsubscribe failed: ${err?.message || "Unknown error"}`);
      });
  }, [address, deleteUser, toggleIsSettingsOpen]);

  const saveEmail = () => {
    // Recheck if save is disabled to handle submission via Enter key
    // which bypasses the save button isDisabled condition
    if (!address || isConfirmingUnsubscribe || isSaveDisabled) return;

    const handleSuccess = (action: string) => {
      successToast(`${action} successful!`);
      toggleIsSettingsOpen();
    };

    const handleError = (action: string, err: Error) => {
      console.error(`${action} failed:`, err);
      errorToast(`${action} failed: ${err?.message || "Unknown error"}`);
    };

    // if user exists then update email
    if (userExists) {
      infoToast("Updating email ...");
      updateEmail({ newEmail: emailInput })
        .then((res) => res && handleSuccess("Email update"))
        .catch((err) => handleError("Email update", err));
    } else {
      infoToast("Adding user ...");
      addUser({ email: emailInput })
        .then((res) => res && handleSuccess("User addition"))
        .catch((err) => handleError("User addition", err));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveEmail();
  };

  return (
    <form className="w-full relative flex flex-col gap-4 py-0 pb-4 px-fluid-12-32-300" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <FormContact
          contactLabel="Email"
          contactPlaceholder="your.email@email.com"
          contactInput={emailInput}
          contactIsValid={emailIsValid}
          setContactInput={setEmailInput}
          isEditing={isEditingEmail}
        />
      </div>
      {!isEmailUpdateable ? (
        <InfoCard
          className="w-fit text-sm mb-2 wrap-break-word"
          msg={`You can update email again ${timeLeftUntil(user?.emailUpdateableAt!)}`}
        />
      ) : null}
      {isConfirmingUnsubscribe ? (
        <AlertMessage
          variant="warning"
          title="Unsubscribe from all notifications?"
          msg="You will stop receiving notifications from all Kleros Products until you subscribe again."
        />
      ) : null}
      <div className="flex flex-row-reverse justify-between gap-2">
        {isConfirmingUnsubscribe ? (
          <>
            <Button
              type="button"
              variant="secondary"
              text="Cancel"
              isDisabled={isDeletingUser}
              onPress={() => setIsConfirmingUnsubscribe(false)}
            />
            <Button
              className={unsubscribeButtonsStyle}
              type="button"
              variant="secondary"
              text="Confirm unsubscribe"
              isDisabled={isFetchingUser || isDeletingUser}
              isLoading={isDeletingUser}
              onPress={handleConfirmUnsubscribe}
            />
          </>
        ) : (
          <>
            {/* 
            * Not type="submit" because the "Cancel" button sits in the same slot, 
            * and clicking it would result in the browser firing the submit event 
            */}
            <Button
              type="button"
              text="Save"
              isDisabled={isSaveDisabled}
              isLoading={isAddingUser || isUpdatingUser}
              onPress={saveEmail}
            />
            {userExists ? (
              <Button
                className={unsubscribeButtonsStyle}
                type="button"
                variant="secondary"
                text="Unsubscribe"
                isDisabled={isFetchingUser || isDeletingUser}
                onPress={() => setIsConfirmingUnsubscribe(true)}
              />
            ) : null}
          </>
        )}
      </div>
      <EmailVerificationInfo toggleIsSettingsOpen={toggleIsSettingsOpen} />
    </form>
  );
};

export default FormContactDetails;
