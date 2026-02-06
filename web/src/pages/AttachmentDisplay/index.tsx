import React, { lazy, Suspense } from "react";

import { Link, useSearchParams } from "react-router-dom";

import NewTabIcon from "svgs/icons/new-tab.svg";

import Loader from "components/Loader";
import ScrollTop from "components/ScrollTop";

import Header from "./Header";
import clsx from "clsx";

const FileViewer = lazy(() => import("components/FileViewer"));

const AttachmentDisplay: React.FC = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");

  return (
    <div
      className={clsx(
        "flex flex-col w-full max-w-landscape",
        "mx-auto bg-klerosUIComponentsLightBackground",
        "pt-8 pb-10 px-4 lg:pt-12 lg:pb-[60px] lg:px-fluid-0-132"
      )}
    >
      <Header />
      {url ? (
        <>
          <Link
            className="flex gap-2 items-center self-end mb-2 hover:underline"
            to={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open in new tab <NewTabIcon className="fill-klerosUIComponentsPrimaryBlue" />
          </Link>
          <Suspense
            fallback={
              <div className="flex justify-center w-full">
                <Loader width={"48px"} height={"48px"} />
              </div>
            }
          >
            <FileViewer url={url} />
          </Suspense>
        </>
      ) : null}
      <ScrollTop />
    </div>
  );
};

export default AttachmentDisplay;
