import styled, { createGlobalStyle } from "styled-components";

export const MDXEditorContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.whiteBackground};

  .mdxeditor {
    background-color: ${({ theme }) => theme.whiteBackground};
  }

  .mdxeditor-root-contenteditable {
    min-height: 100px;
    padding: 12px;
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.primaryText};
  }

  .mdxeditor-toolbar {
    border-bottom: 1px solid ${({ theme }) => theme.stroke};
    background-color: ${({ theme }) => theme.lightBackground};
    padding: 8px;
  }
`;

export const MDXEditorGlobalStyles = createGlobalStyle`
  .mdxeditor {
    --color-accent: ${({ theme }) => theme.primaryBlue};
    --color-accent-2: ${({ theme }) => theme.secondaryBlue};
    --color-base-25: ${({ theme }) => theme.lightGrey};
    --color-base-50: ${({ theme }) => theme.stroke};
    --color-base-100: ${({ theme }) => theme.secondaryText};
    --color-base-300: ${({ theme }) => theme.primaryText};
    --color-base-content: ${({ theme }) => theme.primaryText};
    --color-neutral: ${({ theme }) => theme.whiteBackground};
    --color-neutral-50: ${({ theme }) => theme.lightBackground};
    --color-neutral-100: ${({ theme }) => theme.lightGrey};
    --color-neutral-content: ${({ theme }) => theme.primaryText};
  }

  .mdxeditor-toolbar button {
    color: ${({ theme }) => theme.primaryText};
    border: none;
    background: transparent;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 0 2px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.lightGrey};
    }

    &[data-active="true"] {
      background-color: ${({ theme }) => theme.primaryBlue};
      color: ${({ theme }) => theme.whiteBackground};
    }
  }

  .mdxeditor-toolbar select {
    background-color: ${({ theme }) => theme.whiteBackground};
    color: ${({ theme }) => theme.primaryText};
    border: 1px solid ${({ theme }) => theme.stroke};
    border-radius: 4px;
    padding: 4px 8px;
    margin: 0 2px;
  }

  .mdxeditor-toolbar .mdxeditor-toolbar-separator {
    background-color: ${({ theme }) => theme.stroke};
    width: 1px;
    height: 20px;
    margin: 0 4px;
  }
`;