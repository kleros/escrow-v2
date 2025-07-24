import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";

interface Props {
  message: string;
}

const BufferPeriodWarning: React.FC<Props> = ({ message }) => (
  <AlertMessage variant="warning" title="Buffer period active" msg={message} />
);

export default BufferPeriodWarning;