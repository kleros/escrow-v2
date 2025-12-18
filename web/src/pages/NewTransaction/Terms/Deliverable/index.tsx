import React from "react";
import { errorToast } from "utils/wrapWithToast";
import { FileUploader } from "@kleros/ui-components-library";
import MarkdownEditor from "components/MarkdownEditor";
import { useNewTransactionContext } from "context/NewTransactionContext";
import NavigationButtons from "../../NavigationButtons";
import TokenTransaction from "../Payment/TokenTransaction";
import Header from "pages/NewTransaction/Header";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";

const Deliverable: React.FC = () => {
  const {
    escrowType,
    deliverableText,
    setDeliverableText,
    setDeliverableFile,
    receivingQuantity,
    setReceivingQuantity,
    receivingToken,
    setReceivingToken,
    buyerAddress,
    setBuyerAddress,
  } = useNewTransactionContext();
  const { roleRestrictions } = useAtlasProvider();

  const isDesktop = useIsDesktop();
  const handleWrite = (value: string) => {
    setDeliverableText(value);
  };

  const handleAttachFile = (file: File) => {
    setDeliverableFile(file);
    if (file.type !== "application/pdf") {
      errorToast("That type of file is not valid. Please upload a PDF file.");
    }
  };

  const fileFootMessage =
    "You can attach additional information here. Important: the above description must reference " +
    "the relevant parts of the file content.\n" +
    (getFileUploaderMsg(Roles.Policy, roleRestrictions) ?? "");

  return (
    <div className="flex flex-col items-center">
      {escrowType === "general" ? (
        <>
          <Header text="Contract Terms" />
          <div className="w-[84vw] mb-4 lg:w-fluid-342-699">
            <MarkdownEditor
              value={deliverableText}
              onChange={handleWrite}
              placeholder="eg. I should receive a website created in React with the following specification: x,y,z."
            />
          </div>
          <FileUploader
            className="w-[84vw] lg:w-fluid-342-699 [&_small]:whitespace-pre-line"
            callback={handleAttachFile}
            variant={isDesktop ? "info" : undefined}
            msg={fileFootMessage}
          />
          <NavigationButtons prevRoute="/new-transaction/title" nextRoute="/new-transaction/payment" />
        </>
      ) : (
        <TokenTransaction
          headerText="I should receive"
          prevRoute="/new-transaction/title"
          nextRoute="/new-transaction/payment"
          quantity={receivingQuantity}
          setQuantity={setReceivingQuantity}
          token={receivingToken}
          setToken={setReceivingToken}
          recipientAddress={buyerAddress}
          setRecipientAddress={setBuyerAddress}
        />
      )}
    </div>
  );
};

export default Deliverable;
