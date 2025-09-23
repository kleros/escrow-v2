import React, { useRef } from "react";
import styled from "styled-components";

import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertTable,
  InsertCodeBlock,
  BlockTypeSelect,
  Separator,
} from "@mdxeditor/editor";

import { isValidUrl } from "utils/urlValidation";

import { MDXEditorContainer, MDXEditorGlobalStyles } from "styles/mdxEditorTheme";

import "@mdxeditor/editor/style.css";

const Container = styled(MDXEditorContainer)<{ isEmpty: boolean }>``;

interface IMarkdownEditor {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor: React.FC<IMarkdownEditor> = ({
  value,
  onChange,
  placeholder,
}) => {
  const editorRef = useRef<MDXEditorMethods>(null);

  const handleChange = (markdown: string) => {
    let cleanedMarkdown = markdown === "\u200B" ? "" : markdown.replace(/^\u200B/, "");
    // Remove ALL escape characters - no exceptions
    cleanedMarkdown = cleanedMarkdown.replace(/\\([`[]*_#|>-+=~^{}()!&<$%\\])/g, "$1");
    // Also handle multiple consecutive backslashes that might accumulate
    cleanedMarkdown = cleanedMarkdown.replace(/\\+/g, "");

    onChange(cleanedMarkdown);
  };

  const handleContainerClick = () => {
    if (isEmpty && editorRef.current) {
      editorRef.current.setMarkdown("\u200B");
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 0);
    }
  };

  const isEmpty = !value || value.trim() === "";

  const editorProps: MDXEditorProps = {
    markdown: value,
    onChange: handleChange,
    placeholder,
    suppressHtmlProcessing: true,
    plugins: [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      markdownShortcutPlugin(),
      linkPlugin({
        validateUrl: (url) => isValidUrl(url),
      }),
      linkDialogPlugin(),
      tablePlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "text" }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          text: "Code",
        },
      }),
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <Separator />
            <BoldItalicUnderlineToggles />
            <InsertCodeBlock />
            <Separator />
            <BlockTypeSelect />
            <Separator />
            <ListsToggle />
            <Separator />
            <CreateLink />
            <InsertTable />
          </>
        ),
      }),
    ],
  };

  return (
    <>
      <MDXEditorGlobalStyles />
      <Container isEmpty={isEmpty} onClick={handleContainerClick} role="region" aria-label="Markdown editor">
        <MDXEditor ref={editorRef} {...editorProps} aria-label="Rich text editor for markdown content" />
      </Container>
    </>
  );
};

export default MarkdownEditor;