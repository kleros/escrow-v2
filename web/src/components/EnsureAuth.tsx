import React, { useMemo, useState } from "react";
import * as jwt from "jose";
import { SiweMessage } from "siwe";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { Button } from "@kleros/ui-components-library";
import { DEFAULT_CHAIN } from "consts/chains";
import { useSessionStorage } from "hooks/useSessionStorage";
import { authoriseUser, getNonce } from "utils/authoriseUser";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
`;

const StyledInfo = styled.p`
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
  const localToken = window.sessionStorage.getItem("auth-token");
  const [isLoading, setIsLoading] = useState(false);

  const [authToken, setAuthToken] = useSessionStorage<string | null>("auth-token", localToken);
  const { address } = useAccount();
  const chainId = useChainId();

  const { signMessageAsync } = useSignMessage();

  const isVerified = useMemo(() => {
    if (!authToken || !address) return false;

    const payload = jwt.decodeJwt(authToken);

    if ((payload?.id as string).toLowerCase() !== address.toLowerCase()) return false;
    if (payload.exp && payload.exp < Date.now() / 1000) return false;

    return true;
  }, [authToken, address]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      if (!address) return;

      const message = await createSiweMessage(address, "Sign In to Kleros with Ethereum.", chainId);

      const signature = await signMessageAsync({ message });

      if (!signature) return;

      authoriseUser({
        address,
        signature,
        message,
      })
        .then(async (res) => {
          const response = await res.json();
          setAuthToken(response["token"]);
        })
        .catch((err) => console.log({ err }))
        .finally(() => setIsLoading(false));
    } catch (err) {
      setIsLoading(false);
      console.log({ err });
    }
  };

  return isVerified ? (
    children
  ) : (
    <Container>
      {message ? <StyledInfo>{message}</StyledInfo> : null}
      <Button
        text={buttonText ?? "Sign In"}
        onClick={handleSignIn}
        disabled={isLoading}
        isLoading={isLoading}
        {...{ className }}
      />
    </Container>
  );
};

async function createSiweMessage(address: `0x${string}`, statement: string, chainId: number = DEFAULT_CHAIN) {
  const domain = window.location.host;
  const origin = window.location.origin;
  const response = await getNonce(address);
  const nonce = (await response.json()).nonce;

  // signature is valid only for 10 mins
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId,
    nonce,
    expirationTime,
  });
  return message.prepareMessage();
}