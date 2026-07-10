import { IPFS_GATEWAY } from "consts/index";

//CID shape check for CIDv0 and CIDv1 in base32 (the standard's default encoding).
const CID_REGEX = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{50,})([/?#]|$)/;

//Strips the common IPFS URI prefixes, leaving only the CID or CID/path.
const toIpfsPath = (uri: string) =>
  uri
    .trim()
    .replace(/^(?:ipfs:|fs:)\/*/, "")
    .replace(/^\/?(?:ipfs\/)?/, "");

//Resolves a URI to an HTTP URL.
//IPFS URIs in any of their common forms resolve to the configured gateway. Absolute http(s) URLs are returned unchanged.
export const toHttpUrl = (uri: string | null | undefined) => {
  if (typeof uri !== "string" || uri.trim() === "") return undefined;
  if (/^https?:\/\//.test(uri.trim())) return uri.trim();
  return `${IPFS_GATEWAY}/ipfs/${toIpfsPath(uri)}`;
};

//Evidence type URIs must be content-addressed.
export const isContentAddressed = (uri: string | null | undefined) =>
  typeof uri === "string" && CID_REGEX.test(toIpfsPath(uri));
