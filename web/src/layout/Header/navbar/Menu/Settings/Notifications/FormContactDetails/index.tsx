import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useAccount } from "wagmi";

import { Button } from "@kleros/ui-components-library";

import { EMAIL_REGEX } from "consts/index";

import { responsiveSize } from "styles/responsiveSize";

import { ISettings } from "../../../../index";

import FormContact from "./FormContact";
import { isUndefined } from "src/utils";
import { timeLeftUntil } from "utils/date";
import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import InfoCard from "components/InfoCard";
import EmailVerificationInfo from "./EmailVerificationInfo";

const FormContainer = styled.form`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 ${responsiveSize(12, 32, 300)};
  padding-bottom: 16px;
  gap: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const FormContactContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInfoCard = styled(InfoCard)`
  width: fit-content;
  font-size: 14px;
  margin-bottom: 8px;
  word-wrap: break-word;
`;

const FormContactDetails: React.FC<ISettings> = ({ toggleIsSettingsOpen }) => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailIsValid, setEmailIsValid] = useState<boolean>(false);
  const { address } = useAccount();
  const { user, isAddingUser, isFetchingUser, addUser, updateEmail, isUpdatingUser, userExists } = useAtlasProvider();

  const isEditingEmail = user?.email !== emailInput;

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
    <FormContainer onSubmit={handleSubmit}>
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
      <FormContactContainer>
        <FormContact
          contactLabel="Email"
          contactPlaceholder="your.email@email.com"
          contactInput={emailInput}
          contactIsValid={emailIsValid}
          setContactInput={setEmailInput}
          setContactIsValid={setEmailIsValid}
          validator={EMAIL_REGEX}
          isEditing={isEditingEmail}
        />
      </FormContactContainer>
      {!isEmailUpdateable ? (
        <StyledInfoCard msg={`You can update email again ${timeLeftUntil(user?.emailUpdateableAt!)}`} />
      ) : null}
      <ButtonContainer>
        <Button
          text="Save"
          isDisabled={
            !isEditingEmail || !emailIsValid || isAddingUser || isFetchingUser || isUpdatingUser || !isEmailUpdateable
          }
          isLoading={isAddingUser || isUpdatingUser}
        />
      </ButtonContainer>
      <EmailVerificationInfo toggleIsSettingsOpen={toggleIsSettingsOpen} />
    </FormContainer>
  );
};

export default FormContactDetails;
