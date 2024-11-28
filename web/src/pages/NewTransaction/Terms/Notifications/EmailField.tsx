import React, { useEffect, useState } from "react";
import { Field } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { EMAIL_REGEX } from "src/consts";
import { isEmpty, isUndefined } from "src/utils";
import { useAtlasProvider } from "@kleros/kleros-app";
import InfoCard from "components/InfoCard";
import { timeLeftUntil } from "utils/date";

const StyledField = styled(Field)`
  width: 84vw;
  margin-bottom: 48px;

  input {
    font-size: 16px;
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 476)};
    `
  )}
`;

const StyledInfoCard = styled(InfoCard)`
  width: fit-content;
  font-size: 14px;
  margin-bottom: 12px;
  word-wrap: break-word;
  align-self: flex-start;
`;

const EmailField: React.FC = () => {
  const { notificationEmail, setNotificationEmail } = useNewTransactionContext();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { user } = useAtlasProvider();

  const isEmailUpdateable = user?.email
    ? !isUndefined(user?.emailUpdateableAt) && new Date(user.emailUpdateableAt!).getTime() < new Date().getTime()
    : true;

  useEffect(() => {
    if (!user) return;

    setNotificationEmail(user.email ?? "");
  }, [user]);

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setNotificationEmail(input);
    setIsEmailValid(isEmpty(input) || EMAIL_REGEX.test(input));
  };

  const variant = isEmpty(notificationEmail) ? "info" : isEmailValid ? "success" : "error";

  const message =
    isEmailValid || isEmpty(notificationEmail)
      ? "We advise you to subscribe to notifications to be informed about the escrow progress."
      : "Email is not valid.";

  return (
    <>
      {!isEmailUpdateable ? (
        <StyledInfoCard msg={`You can update email again ${timeLeftUntil(user?.emailUpdateableAt!)}`} />
      ) : null}
      <StyledField
        type="email"
        value={notificationEmail}
        onChange={handleWrite}
        placeholder="youremail@email.com"
        variant={variant}
        message={message}
        disabled={!isEmailUpdateable}
      />
    </>
  );
};

export default EmailField;
