import { AlertMessage } from "@kleros/ui-components-library";
import React from "react";

interface IDisputeInfo {
  pendingParty: string;
}

const DisputeInfo: React.FC<IDisputeInfo> = ({ pendingParty }) => {
  return (
    <AlertMessage
      variant="info"
      title="Follow the case closely to avoid missing the deadlines"
      msg="We suggest you add evidence to support your case. It can be done directly on Kleros Court."
    />
  );
};
export default DisputeInfo;
