import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { toast } from "react-toastify";
import { OPTIONS } from "utils/wrapWithToast";
import { FileUploader, Textarea } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { responsiveSize } from "styles/responsiveSize";
import NavigationButtons from "../../NavigationButtons";
import TokenTransaction from "../Payment/TokenTransaction";
import Header from "pages/NewTransaction/Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTextArea = styled(Textarea)`
  width: 84vw;
  height: 200px;
  margin-bottom: 16px;
  textarea {
    font-size: 16px;
  }

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 699)};
    `
  )}
`;

const StyledFileUploader = styled(FileUploader)`
  width: 84vw;
  margin-bottom: ${responsiveSize(72, 52)};

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
    receivingRecipientAddress,
    setReceivingRecipientAddress,
  } = useNewTransactionContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliverableText(event.target.value);
  };

  const handleAttachFile = (file: File) => {
    setDeliverableFile(file);
    if (file.type !== "application/pdf") {
      toast.error("That type of file is not valid. Please upload a PDF file.", OPTIONS);
    }
  };

  const fileFootMessage =
    "You can attach additional information as a PDF file. Important: the above description must reference " +
    "the relevant parts of the file content.";

  return (
    <Container>
      {escrowType === "general" ? (
        <>
          <Header text="Contract Terms" />
          <StyledTextArea
            value={deliverableText}
            onChange={handleWrite}
            placeholder="eg. I should receive a website created in React with the following specification: x,y,z."
          />
          <StyledFileUploader callback={handleAttachFile} variant="info" msg={fileFootMessage} />
          <NavigationButtons prevRoute="/newTransaction/title" nextRoute="/newTransaction/payment" />
        </>
      ) : (
        <TokenTransaction
          headerText="I should receive"
          prevRoute="/newTransaction/title"
          nextRoute="/newTransaction/payment"
          quantity={receivingQuantity}
          setQuantity={setReceivingQuantity}
          token={receivingToken}
          setToken={setReceivingToken}
          recipientAddress={receivingRecipientAddress}
          setRecipientAddress={setReceivingRecipientAddress}
        />
      )}
    </Container>
  );
};

export default Deliverable;
