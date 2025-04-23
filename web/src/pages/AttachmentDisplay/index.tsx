import React, { lazy, Suspense } from "react";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle, MAX_WIDTH_LANDSCAPE } from "styles/landscapeStyle";

import { useSearchParams } from "react-router-dom";

import NewTabIcon from "svgs/icons/new-tab.svg";

import Loader from "components/Loader";
import ScrollTop from "components/ScrollTop";
import { ExternalLink } from "components/ExternalLink";

import Header from "./Header";

const FileViewer = lazy(() => import("components/FileViewer"));

const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: 32px 16px 40px;
  max-width: ${MAX_WIDTH_LANDSCAPE};
  flex-direction: column;
  margin: 0 auto;

  ${landscapeStyle(
    () => css`
      padding: 48px ${responsiveSize(0, 132)} 60px;
    `
  )}
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StyledExternalLink = styled(ExternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-end;
  margin-bottom: 8px;
`;

const StyledNewTabIcon = styled(NewTabIcon)`
  path {
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const AttachmentDisplay: React.FC = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");

  return (
    <Container>
      <Header />
      {url ? (
        <>
          <StyledExternalLink to={url} rel="noopener noreferrer" target="_blank">
            Open in new tab <StyledNewTabIcon />
          </StyledExternalLink>
          <Suspense
            fallback={
              <LoaderContainer>
                <Loader width={"48px"} height={"48px"} />
              </LoaderContainer>
            }
          >
            <FileViewer url={url} />
          </Suspense>
        </>
      ) : null}
      <ScrollTop />
    </Container>
  );
};

export default AttachmentDisplay;
