import React from "react";

import { type DocRenderer } from "@cyntler/react-doc-viewer";

import MarkdownRenderer from "../../MarkdownRenderer";

const MarkdownDocRenderer: DocRenderer = ({ mainState: { currentDocument } }) => {
  if (!currentDocument) return null;
  const base64String = (currentDocument.fileData as string).split(",")[1];

  // Decode the base64 string
  const decodedData = atob(base64String);

  return (
    <div className="p-4" id="md-renderer">
      <MarkdownRenderer content={decodedData} />
    </div>
  );
};

MarkdownDocRenderer.fileTypes = ["md", "text/plain"];
MarkdownDocRenderer.weight = 1;

export default MarkdownDocRenderer;
