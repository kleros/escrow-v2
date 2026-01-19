import React from "react";
import { Button, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import { baseModalStyle } from "src/styles/modalStyles";

interface IExternalLinkWarning {
  isOpen: boolean;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExternalLinkWarning: React.FC<IExternalLinkWarning> = ({ isOpen, url, onConfirm, onCancel }) => {
  return (
    <Modal
      className={clsx(baseModalStyle, "w-[400px] max-w-[90vw] gap-4 items-center")}
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => !open && onCancel()}
    >
      <h3 className="m-0 text-klerosUIComponentsPrimaryText text-xl font-semibold">External Link Warning</h3>
      <p className="m-0 text-klerosUIComponentsSecondaryText text-base text-justify">
        You are about to navigate to an external website. Please verify the URL before proceeding to ensure your safety.
      </p>
      <div
        className={clsx(
          "bg-klerosUIComponentsLightBackground border rounded-sm border-klerosUIComponentsStroke",
          "text-sm font-mono text-klerosUIComponentsPrimaryText break-all",
          "w-full py-2 px-3"
        )}
      >
        {url}
      </div>
      <div className="flex justify-center w-full gap-3">
        <Button variant="secondary" text="Cancel" onPress={onCancel} />
        <Button variant="primary" text="Continue" onPress={onConfirm} />
      </div>
    </Modal>
  );
};

export default ExternalLinkWarning;
