import React, { useCallback } from "react";

import { useAccount } from "wagmi";

import { Button } from "@kleros/ui-components-library";

import styled from "styled-components";
import { useAtlasProvider } from "@kleros/kleros-app";
import { errorToast, infoToast, successToast } from "utils/wrapWithToast";
import { StyledP } from "./StyledTags";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
`;

const StyledInfo = styled(StyledP)`
  margin: 0;
  padding: 0;
`;

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
    <Container>
      {message ? <StyledInfo>{message}</StyledInfo> : null}
      <Button
        text={buttonText ?? "Sign In"}
        onPress={handleClick}
        isDisabled={isSigningIn || !address}
        isLoading={isSigningIn}
        {...{ className }}
      />
    </Container>
  );
};
