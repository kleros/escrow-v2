import React, { lazy, Suspense } from "react";
import styled from "styled-components";

import { useSearchParams } from "react-router-dom";

import NewTabIcon from "svgs/icons/new-tab.svg";

import Loader from "components/Loader";

import Header from "./Header";
import { StyledA } from "components/StyledTags";

const FileViewer = lazy(() => import("components/FileViewer"));

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const NewTabInfo = styled(StyledA)`
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
    </Container>
  );
};

export default AttachmentDisplay;
