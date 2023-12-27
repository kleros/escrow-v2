import { toast } from "react-toastify";
import { OPTIONS as toastOptions } from "utils/wrapWithToast";

export function uploadFileToIPFS(file: File): Promise<Response> {
  return toast.promise<Response, Error>(
    (async () => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      
      const response = await fetch("/.netlify/functions/uploadToIPFS?dapp=court&key=kleros-v2&operation=evidence", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Error uploading to IPFS" }));
        throw new Error(error.message);
      }
      return response;
    })(),
    {
      pending: "Uploading file to IPFS...",
      success: "Uploaded successfully!",
      error: {
        render({ data: error }) {
          return `Upload failed: ${error?.message}`;
        },
      },
    },
    toastOptions
  );
}
