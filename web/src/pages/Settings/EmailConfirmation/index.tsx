import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { isAddress } from "viem";
import { Button } from "@kleros/ui-components-library";
import CheckIcon from "svgs/icons/check-circle-outline.svg";
import WarningIcon from "svgs/icons/warning-outline.svg";
import InvalidIcon from "svgs/icons/minus-circle.svg";
import Loader from "components/Loader";
import { useAtlasProvider } from "@kleros/kleros-app";
import { cn } from "src/utils";

enum TextColor {
  Primary,
  Error,
  Success,
  Warning,
}

const textStyle = "text-center whitespace-pre-line lg:text-left";

const textColorStyles: Record<TextColor, string> = {
  [TextColor.Primary]: "text-klerosUIComponentsPrimaryText",
  [TextColor.Error]: "text-klerosUIComponentsError",
  [TextColor.Success]: "text-klerosUIComponentsSuccess",
  [TextColor.Warning]: "text-klerosUIComponentsWarning",
};

const iconColorStyles: Record<TextColor, string> = {
  [TextColor.Primary]: "[&_path]:fill-klerosUIComponentsPrimaryText",
  [TextColor.Error]: "[&_path]:fill-klerosUIComponentsError",
  [TextColor.Success]: "[&_path]:fill-klerosUIComponentsSuccess",
  [TextColor.Warning]: "[&_path]:fill-klerosUIComponentsWarning",
};

const messageConfigs = {
  invalid: {
    headerMsg: "Invalid Link!",
    subtitleMsg: "Oops, seems like you followed an invalid link.",
    buttonMsg: "Contact Support",
    buttonTo: "https://t.me/kleros",
    Icon: InvalidIcon,
    color: TextColor.Primary,
  },
  error: {
    headerMsg: "Something went wrong",
    subtitleMsg: "Oops, seems like something went wrong in our systems",
    buttonMsg: "Contact Support",
    buttonTo: "https://t.me/kleros",
    Icon: WarningIcon,
    color: TextColor.Error,
  },
  confirmed: {
    headerMsg: "Congratulations! \nYour email has been verified!",
    subtitleMsg:
      "We'll remind you when your actions are required on Escrow, and send you notifications on key moments to help you achieve the best of Kleros.",
    buttonMsg: "Let's start!",
    buttonTo: "/",
    Icon: CheckIcon,
    color: TextColor.Success,
  },
  expired: {
    headerMsg: "Verification link expired...",
    subtitleMsg:
      "Oops, the email verification link has expired. No worries! Go to settings and click on Resend it to receive another verification email.",
    buttonMsg: "Open Settings",
    buttonTo: "/#notifications",
    Icon: WarningIcon,
    color: TextColor.Warning,
  },
};

const EmailConfirmation: React.FC = () => {
  const { confirmEmail } = useAtlasProvider();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchParams, _] = useSearchParams();
  const address = searchParams.get("address");
  const token = searchParams.get("token");

  useEffect(() => {
    if (address && isAddress(address) && token) {
      setIsConfirming(true);

      confirmEmail({ address, token })
        .then((res) => {
          setIsConfirmed(res.isConfirmed);
          setIsTokenInvalid(res.isTokenInvalid);
          setIsError(res.isError);
        })
        .finally(() => setIsConfirming(false));
    }
  }, [address, token, confirmEmail]);

  const { headerMsg, subtitleMsg, buttonMsg, buttonTo, Icon, color } = useMemo(() => {
    if (!address || !isAddress(address) || !token || isTokenInvalid) return messageConfigs.invalid;
    if (isError) return messageConfigs.error;
    if (isConfirmed) return messageConfigs.confirmed;
    return messageConfigs.expired;
  }, [address, token, isError, isConfirmed, isTokenInvalid]);

  return (
    <div
      className={cn(
        "flex flex-col gap-y-12 gap-x-4",
        "w-full justify-center items-center mt-20",
        "lg:flex-row lg:justify-between"
      )}
    >
      {isConfirming ? (
        <Loader width={"148px"} height={"148px"} />
      ) : (
        <>
          <div className={cn("flex flex-col grow gap-8", "items-center lg:items-start")}>
            <Icon width={64} height={64} className={cn(iconColorStyles[color])} />
            <h1 className={cn(textStyle, textColorStyles[color])}>{headerMsg}</h1>
            <h3 className={cn("max-w-[735px] text-base text-klerosUIComponentsPrimaryText font-semibold", textStyle)}>
              {subtitleMsg}
            </h3>
            <Link to={buttonTo}>
              <Button text={buttonMsg} />
            </Link>
          </div>
          <Icon width={250} height={250} className="[&_path]:fill-klerosUIComponentsWhiteBackground" />
        </>
      )}
    </div>
  );
};

export default EmailConfirmation;
