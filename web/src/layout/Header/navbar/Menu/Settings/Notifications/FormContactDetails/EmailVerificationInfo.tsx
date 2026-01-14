import React, { useCallback } from "react";

import { Button } from "@kleros/ui-components-library";

import HourglassIcon from "svgs/icons/hourglass.svg";
import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import clsx from "clsx";

interface IEmailInfo {
  toggleIsSettingsOpen: () => void;
}

const EmailVerificationInfo: React.FC<IEmailInfo> = ({ toggleIsSettingsOpen }) => {
  const { userExists, user, updateEmail } = useAtlasProvider();

  const resendVerificationEmail = useCallback(() => {
    if (!user) return;
    infoToast(`Sending verification email ...`);
    updateEmail({ newEmail: user.email })
      .then(async (res) => {
        if (res) {
          successToast("Verification email sent successfully!");
          toggleIsSettingsOpen();
        }
      })
      .catch((err) => {
        console.log(err);
        errorToast(`Failed to send verification email: ${err?.message}`);
      });
  }, [user, updateEmail, toggleIsSettingsOpen]);

  return userExists && !user?.isEmailVerified ? (
    <div
      className={clsx(
        "flex flex-row items-center gap-4",
        "w-full pt-4 mt-8",
        "border-t border-klerosUIComponentsStroke"
      )}
    >
      <HourglassIcon width={32} height={32} className="fill-klerosUIComponentsPrimaryBlue" />
      <div className="flex flex-col items-start gap-2">
        <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">Email Verification Pending</h3>
        <label>
          We sent you a verification email. Please, verify it.
          <br /> Didn’t receive the email?{" "}
          <Button
            variant="secondary"
            className={clsx(
              "inline-block bg-transparent p-0 border-none focus:bg-transparent hover:bg-transparent",
              "[&_.button-text]:text-sm [&_.button-text]:font-normal"
            )}
            text="Resend it"
            onPress={resendVerificationEmail}
          />
        </label>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default EmailVerificationInfo;
