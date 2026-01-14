import React, { useRef } from "react";
import { useClickAway } from "react-use";
import { Button } from "@kleros/ui-components-library";
import { Overlay } from "components/Overlay";
import StyledModal from "pages/MyTransactions/Modal/StyledModal";
import clsx from "clsx";

interface IExternalLinkWarning {
  isOpen: boolean;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExternalLinkWarning: React.FC<IExternalLinkWarning> = ({ isOpen, url, onConfirm, onCancel }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickAway(modalRef, onCancel);

  if (!isOpen) return null;

  return (
    <>
      <Overlay>
        <StyledModal className="w-[400px] max-w-[90vw] gap-4 items-center" ref={modalRef}>
          <h3 className="m-0 text-klerosUIComponentsPrimaryText text-xl font-semibold">External Link Warning</h3>
          <p className="m-0 text-klerosUIComponentsSecondaryText text-base text-justify">
            You are about to navigate to an external website. Please verify the URL before proceeding to ensure your
            safety.
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
        </StyledModal>
      </Overlay>
    </>
  );
};

export default ExternalLinkWarning;
