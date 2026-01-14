import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { isExternalLink } from "utils/linkUtils";
import { isValidUrl } from "utils/urlValidation";

import ExternalLinkWarning from "components/ExternalLinkWarning";
import "styles/markdownRendererStyles.css";
import { cn } from "src/utils";

interface IMarkdownRenderer {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<IMarkdownRenderer> = ({ content, className }) => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExternalLink = useCallback((url: string) => {
    setPendingUrl(url);
    setIsWarningOpen(true);
  }, []);

  const handleConfirmNavigation = useCallback(() => {
    if (pendingUrl) {
      window.open(pendingUrl, "_blank", "noopener,noreferrer");
    }
    setIsWarningOpen(false);
    setPendingUrl("");
  }, [pendingUrl]);

  const handleCancelNavigation = useCallback(() => {
    setIsWarningOpen(false);
    setPendingUrl("");
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;

      if (!container.contains(target)) {
        return;
      }

      const linkElement = target.closest("a") as HTMLAnchorElement | null;

      if (linkElement) {
        const href = linkElement.getAttribute("href") || linkElement.href;
        if (href && isValidUrl(href) && isExternalLink(href)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          handleExternalLink(href);
        }
      }
    };

    container.addEventListener("click", handleClick, true);

    return () => {
      container.removeEventListener("click", handleClick, true);
    };
  }, [handleExternalLink]);

  if (!content || content.trim() === "") {
    return null;
  }

  return (
    <>
      <div
        ref={containerRef}
        className={cn("markdown-renderer", className)}
        role="region"
        aria-label="Markdown content"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            [
              rehypeSanitize,
              {
                tagNames: [
                  "p",
                  "br",
                  "hr",
                  "h1",
                  "h2",
                  "h3",
                  "h4",
                  "h5",
                  "h6",
                  "ul",
                  "ol",
                  "li",
                  "input",
                  "strong",
                  "b",
                  "em",
                  "i",
                  "u",
                  "del",
                  "s",
                  "mark",
                  "small",
                  "sub",
                  "sup",
                  "code",
                  "pre",
                  "kbd",
                  "samp",
                  "var",
                  "a",
                  "img",
                  "table",
                  "thead",
                  "tbody",
                  "tfoot",
                  "tr",
                  "th",
                  "td",
                  "caption",
                  "blockquote",
                  "div",
                  "span",
                  "section",
                  "article",
                  "aside",
                  "nav",
                  "main",
                  "header",
                  "footer",
                  "details",
                  "summary",
                  "abbr",
                  "cite",
                  "dfn",
                  "time",
                  "address",
                ],
                attributes: {
                  "*": ["className", "id", "style"],
                  a: ["href", "title", "target", "rel"],
                  img: ["src", "alt", "title", "width", "height"],
                  input: ["type", "checked", "disabled"],
                  th: ["scope", "colspan", "rowspan"],
                  td: ["colspan", "rowspan"],
                  details: ["open"],
                  time: ["dateTime"],
                  abbr: ["title"],
                },
              },
            ],
          ]}
          components={{
            a: ({ href, children, ...props }) => {
              return (
                <a href={href} {...props}>
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <ExternalLinkWarning
        isOpen={isWarningOpen}
        url={pendingUrl}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </>
  );
};

export default MarkdownRenderer;
