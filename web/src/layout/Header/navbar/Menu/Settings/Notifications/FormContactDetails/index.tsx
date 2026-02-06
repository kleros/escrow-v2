import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

import { Button } from "@kleros/ui-components-library";

import { EMAIL_REGEX } from "consts/index";

import { ISettings } from "../../../../index";

import FormContact from "./FormContact";
import { isUndefined } from "src/utils";
import { timeLeftUntil } from "utils/date";
import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import InfoCard from "components/InfoCard";
import EmailVerificationInfo from "./EmailVerificationInfo";

const FormContactDetails: React.FC<ISettings> = ({ toggleIsSettingsOpen }) => {
  const [emailInput, setEmailInput] = useState<string>("");
  const { address } = useAccount();
  const { user, isAddingUser, isFetchingUser, addUser, updateEmail, isUpdatingUser, userExists } = useAtlasProvider();

  const isEditingEmail = user?.email !== emailInput;
  const emailIsValid = EMAIL_REGEX.test(emailInput);

  const isEmailUpdateable = user?.email
    ? !isUndefined(user?.emailUpdateableAt) && new Date(user.emailUpdateableAt!).getTime() < new Date().getTime()
    : true;

  useEffect(() => {
    if (!user || !userExists) return;

    setEmailInput(user.email);
  }, [user, userExists]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address) {
      return;
    }
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
      if (!isEmailUpdateable) return;
      const data = {
        newEmail: emailInput,
      };
      infoToast("Updating email ...");
      updateEmail(data)
        .then((res) => res && handleSuccess("Email update"))
        .catch((err) => handleError("Email update", err));
    } else {
      const data = {
        email: emailInput,
      };
      infoToast("Adding user ...");
      addUser(data)
        .then((res) => res && handleSuccess("User addition"))
        .catch((err) => handleError("User addition", err));
    }
  };

  return (
    <form className="w-full relative flex flex-col gap-4 py-0 pb-4 px-fluid-12-32-300" onSubmit={handleSubmit}>
      {/* <FormContactContainer>
        <FormContact
          contactLabel="Telegram"
          contactPlaceholder="@my_handle"
          contactInput={telegramInput}
          contactIsValid={telegramIsValid}
          setContactInput={setTelegramInput}
          setContactIsValid={setTelegramIsValid}
          validator={TELEGRAM_REGEX}
          isEditing={isEditingTelegram}
        />
      </FormContactContainer> */}
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
      <div className="flex justify-end">
        <Button
          text="Save"
          isDisabled={
            !isEditingEmail || !emailIsValid || isAddingUser || isFetchingUser || isUpdatingUser || !isEmailUpdateable
          }
          isLoading={isAddingUser || isUpdatingUser}
        />
      </div>
      <EmailVerificationInfo toggleIsSettingsOpen={toggleIsSettingsOpen} />
    </form>
  );
};

export default FormContactDetails;
