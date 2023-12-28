import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { FileUploader, Textarea } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { responsiveSize } from "styles/responsiveSize";
import { uploadFileToIPFS } from "utils/uploadFileToIPFS";
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
  margin-bottom: 24px;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(342, 699)};
    `
  )}
`;

const StyledFileUploader = styled(FileUploader)`
  width: 84vw;
  margin-bottom: ${responsiveSize(52, 32)};

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
    deliverableFile,
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

  const handleFileUpload = async (file: File) => {
    try {
      const response = await uploadFileToIPFS(file);
      const responseData = await response.json();
      const ipfsHash = responseData.cids[0];
      console.log("IPFS hash:", ipfsHash);
      setDeliverableFile(ipfsHash);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
    }
  };

  return (
    <Container>
      {escrowType === "general" ? (
        <>
          <Header text="I should receive" />
          <StyledTextArea
            value={deliverableText}
            onChange={handleWrite}
            placeholder="eg. A website created in React with the following specification: x,y,z"
          />
          <StyledFileUploader
            callback={handleFileUpload}
            variant="info"
            msg="Additionally, you can add an external file in PDF or add multiple files in a single .zip file."
          />
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
