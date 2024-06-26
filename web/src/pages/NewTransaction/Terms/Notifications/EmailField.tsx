import React, { useEffect, useState } from "react";
import { Field } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { EMAIL_REGEX } from "src/consts";
import { useUserSettings } from "hooks/queries/useUserSettings";

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

const EmailField: React.FC = () => {
  const { notificationEmail, setNotificationEmail } = useNewTransactionContext();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { data: userSettings } = useUserSettings();

  useEffect(() => {
    if (!userSettings) return;

    setNotificationEmail(userSettings.email ?? "");
  }, [userSettings]);

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setNotificationEmail(input);
    setIsEmailValid(input === "" || EMAIL_REGEX.test(input));
  };

  const variant = notificationEmail === "" ? "info" : isEmailValid ? "success" : "error";

  const message =
    isEmailValid || notificationEmail === ""
      ? "We advise you to subscribe to notifications to be informed about the escrow progress."
      : "Email is not valid.";

  return (
    <StyledField
      type="email"
      value={notificationEmail}
      onChange={handleWrite}
      placeholder="youremail@email.com"
      variant={variant}
      message={message}
    />
  );
};

export default EmailField;
