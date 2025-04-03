import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --toastify-color-info: ${({ theme }) => theme.primaryBlue};
    --toastify-color-success: ${({ theme }) => theme.success};
    --toastify-color-warning: ${({ theme }) => theme.warning};
    --toastify-color-error: ${({ theme }) => theme.error};
  }

  .react-loading-skeleton {
    z-index: 0;
    --base-color: ${({ theme }) => theme.skeletonBackground};
    --highlight-color: ${({ theme }) => theme.skeletonHighlight};
  }

  body {
    font-family: "Open Sans", sans-serif;
    margin: 0px;
    background-color: ${({ theme }) => theme.lightBlue}
  }

  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  .ReactModal__Overlay {
    background-color: #1b003fcc !important;
  }

  a {
    font-weight: 400;
    font-size: 14px;
    text-decoration: none;
    color: ${({ theme }) => theme.primaryBlue};
  }

  ul {
    li {
      color: ${({ theme }) => theme.primaryText};
    }
  }

  .os-theme-dark {
    --os-handle-bg: ${({ theme }) => theme.violetPurple};
    --os-handle-bg-hover: ${({ theme }) => theme.secondaryPurple};
    --os-handle-bg-active: ${({ theme }) => theme.lavenderPurple};
  }

  // @cyntler/react-doc-viewer injects a canvas to load pdf, this is alters the height of body tag, so set to hidden
  .hiddenCanvasElement{
   display: none;
  }

  [class*="Toastify__toast-container"] {
    top: unset;
    padding-top: 20px !important;
  }
`;
