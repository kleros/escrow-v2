import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { errorToast } from "utils/wrapWithToast";
import { FileUploader } from "@kleros/ui-components-library";
import MarkdownEditor from "components/MarkdownEditor";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { responsiveSize } from "styles/responsiveSize";
import NavigationButtons from "../../NavigationButtons";
import TokenTransaction from "../Payment/TokenTransaction";
import Header from "pages/NewTransaction/Header";
import { Roles, useAtlasProvider } from "@kleros/kleros-app";
import { getFileUploaderMsg } from "src/utils";
import useIsDesktop from "hooks/useIsDesktop";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarkdownEditorContainer = styled.div`
  width 84vw;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 699)};
    `
  )}
`;

const StyledFileUploader = styled(FileUploader)`
  width: 84vw;
  margin-top: 16px;
  margin-bottom: ${responsiveSize(130, 72)};

  small {
    white-space: pre-line;
    text-align: start;
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 699)};
    `
  )}
`;

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
    <Container>
      {escrowType === "general" ? (
        <>
          <Header text="Contract Terms" />
          <MarkdownEditorContainer>
            <MarkdownEditor
            value={deliverableText}
            onChange={handleWrite}
            placeholder="eg. I should receive a website created in React with the following specification: x,y,z."
            />
          </MarkdownEditorContainer>
          <StyledFileUploader
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
    </Container>
  );
};

export default Deliverable;
