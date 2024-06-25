import React, { lazy, Suspense } from "react";
import styled from "styled-components";

import { useSearchParams } from "react-router-dom";

import NewTabIcon from "svgs/icons/new-tab.svg";

import Loader from "components/Loader";

import Header from "./Header";

const FileViewer = lazy(() => import("components/FileViewer"));

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: calc(24px + (136 - 24) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-top: calc(32px + (80 - 32) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-bottom: calc(76px + (96 - 76) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  max-width: 1780px;
  margin: 0 auto;
`;

const AttachmentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const NewTabInfo = styled.a`
  align-self: flex-end;
  display: flex;
  gap: 8px;
  align-items: center;
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
      <AttachmentContainer>
        <Header />
        {url ? (
          <>
            <NewTabInfo href={url} rel="noreferrer" target="_blank">
              Open in new tab <StyledNewTabIcon />
            </NewTabInfo>
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
      </AttachmentContainer>
    </Container>
  );
};

export default AttachmentDisplay;
