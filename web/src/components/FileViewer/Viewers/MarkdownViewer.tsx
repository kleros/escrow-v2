import React from "react";
import styled from "styled-components";

import { type DocRenderer } from "@cyntler/react-doc-viewer";
import MarkdownRenderer from "components/MarkdownRenderer";

const Container = styled.div`
  padding: 16px;
`;

const StyledMarkdownRenderer = styled(MarkdownRenderer)`
  background-color: ${({ theme }) => theme.whiteBackground};
`;

const MarkdownViewer: DocRenderer = ({ mainState: { currentDocument } }) => {
  if (!currentDocument) return null;
  const base64String = (currentDocument.fileData as string).split(",")[1];

  // Decode the base64 string
  const decodedData = atob(base64String);

  return (
    <Container id="md-renderer">
      <StyledMarkdownRenderer content={decodedData} />
    </Container>
  );
};

MarkdownViewer.fileTypes = ["md", "text/plain"];
MarkdownViewer.weight = 1;

export default MarkdownViewer;
