import React, { useCallback } from "react";

import { useAccount } from "wagmi";

import { Button } from "@kleros/ui-components-library";

import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";

interface IEnsureAuth {
  children: React.ReactElement;
  message?: string;
  buttonText?: string;
  className?: string;
}

export const EnsureAuth: React.FC<IEnsureAuth> = ({ children, message, buttonText, className }) => {
  const { address } = useAccount();
  const { isVerified, isSigningIn, authoriseUser } = useAtlasProvider();

  const handleClick = useCallback(() => {
    infoToast(`Signing in User...`);

    authoriseUser()
      .then(() => successToast("Signed In successfully!"))
      .catch((err) => {
        console.log(err);
        errorToast(`Sign-In failed: ${err?.message}`);
      });
  }, [authoriseUser]);
  return isVerified ? (
    children
  ) : (
    <div className="flex flex-col gap-4 justify-center items-center">
      {message ? <p className="m-0 p-0">{message}</p> : null}
      <Button
        text={buttonText ?? "Sign In"}
        onPress={handleClick}
        isDisabled={isSigningIn || !address}
        isLoading={isSigningIn}
        {...{ className }}
      />
    </div>
  );
};
