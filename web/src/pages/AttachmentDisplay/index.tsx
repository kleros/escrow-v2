import React, { lazy, Suspense } from "react";

import { Link, useLocation, useSearchParams } from "react-router-dom";

import NewTabIcon from "svgs/icons/new-tab.svg";

import Loader from "components/Loader";
import ScrollTop from "components/ScrollTop";

import { getAllowedAttachmentUrl } from "utils/urlValidation";

import Header from "./Header";
import clsx from "clsx";

const FileViewer = lazy(() =>
  import("@kleros/ui-components-library").then((m) => ({ default: m.FileViewer }))
);

const AttachmentDisplay: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const safeUrl = url ? getAllowedAttachmentUrl(url) : null;

  return (
    <div
      className={clsx(
        "flex flex-col w-full max-w-landscape",
        "mx-auto bg-klerosUIComponentsLightBackground",
        "pt-8 pb-10 px-4 lg:pt-12 lg:pb-[60px] lg:px-fluid-0-132"
      )}
    >
      <Header />
      {safeUrl ? (
        <>
          <Link
            className="flex gap-2 items-center self-end mb-2 hover:underline"
            to={safeUrl}
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
            {
              /* 
              * Use the location.key as the key to force a re-render. 
              * Without this, the FileViewer does not display documents if:
              * - the same document is selected twice in a row from the Policies dropdown menu by mistake.
              * - we are already in the Attachments page but want to see a different document.
              */
            }
            <FileViewer key={location.key} url={safeUrl} />
          </Suspense>
        </>
      ) : null}
      <ScrollTop />
    </div>
  );
};

export default AttachmentDisplay;
