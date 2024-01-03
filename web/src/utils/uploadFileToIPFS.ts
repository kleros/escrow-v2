import { toast } from "react-toastify";
import { OPTIONS as toastOptions } from "utils/wrapWithToast";

export function uploadFileToIPFS(file: File): Promise<Response> {
  return toast.promise<Response, Error>(
    (async () => {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const url = "/.netlify/functions/uploadToIPFS?dapp=escrow&key=escrow-v2&operation=file";

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading to IPFS");
      }

      return response;
    })(),
    {
      pending: "Uploading file to IPFS...",
      success: "Uploaded successfully!",
      error: "Upload failed",
    },
    toastOptions
  );
}
