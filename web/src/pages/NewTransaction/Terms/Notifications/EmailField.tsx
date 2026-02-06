import React, { useEffect, useState } from "react";
import { TextField } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { EMAIL_REGEX } from "src/consts";
import { isEmpty, isUndefined } from "src/utils";
import { useAtlasProvider } from "@kleros/kleros-app";
import InfoCard from "components/InfoCard";
import { timeLeftUntil } from "utils/date";

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

  const handleWrite = (input: string) => {
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
        <InfoCard
          className="w-fit text-sm mb-3 wrap-break-word self-start"
          msg={`You can update email again ${timeLeftUntil(user?.emailUpdateableAt!)}`}
        />
      ) : null}
      <TextField
        aria-label="Notification email"
        className="w-[84vw] lg:w-fluid-342-476"
        type="email"
        value={notificationEmail}
        onChange={handleWrite}
        placeholder="youremail@email.com"
        variant={variant}
        message={message}
        isDisabled={!isEmailUpdateable}
      />
    </>
  );
};

export default EmailField;
