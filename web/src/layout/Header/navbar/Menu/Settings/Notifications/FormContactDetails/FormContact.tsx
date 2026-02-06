import React, { Dispatch, SetStateAction, useMemo } from "react";

import { TextField } from "@kleros/ui-components-library";
import { isEmpty } from "src/utils";

interface IForm {
  contactLabel: string;
  contactPlaceholder: string;
  contactInput: string;
  contactIsValid: boolean;
  setContactInput: Dispatch<SetStateAction<string>>;
  isEditing?: boolean;
}

const FormContact: React.FC<IForm> = ({
  contactLabel,
  contactPlaceholder,
  contactInput,
  contactIsValid,
  setContactInput,
  isEditing,
}) => {
  const fieldVariant = useMemo(() => {
    if (isEmpty(contactInput) || !isEditing) {
      return undefined;
    }
    return contactIsValid ? "success" : "error";
  }, [contactInput, contactIsValid, isEditing]);

  return (
    <TextField
      className="items-center w-full [&_input]:text-sm [&_label]:self-start"
      variant={fieldVariant}
      label={contactLabel}
      placeholder={contactPlaceholder}
      value={contactInput}
      onChange={setContactInput}
    />
  );
};

export default FormContact;
