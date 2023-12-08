import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import Header from "components/Header";
import { FileUploader, Textarea } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { calcMinMax } from "utils/calcMinMax";
import NavigationButtons from "../../NavigationButtons";

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
      width: ${calcMinMax(342, 699)};
    `
  )}
`;

const StyledFileUploader = styled(FileUploader)`
  width: 84vw;
  margin-bottom: ${calcMinMax(52, 32)};

  ${landscapeStyle(
    () => css`
      width: ${calcMinMax(342, 699)};
    `
  )}
`;

const Deliverable: React.FC = () => {
  const { deliverableText, setDeliverableText, deliverableFile, setDeliverableFile } = useNewTransactionContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliverableText(event.target.value);
  };

  return (
    <Container>
      <Header text="I should receive" />
      <StyledTextArea
        value={deliverableText}
        onChange={handleWrite}
        placeholder="eg. A website created in React with the following specification: x,y,z"
      />
      <StyledFileUploader
        callback={(file: File) => setDeliverableFile(file)}
        variant="info"
        msg="Additionally, you can add an external file in PDF or add multiple files in a single .zip file."
      />
      <NavigationButtons prevRoute="/newTransaction/title" nextRoute="/newTransaction/payment" />
    </Container>
  );
};
export default Deliverable;
