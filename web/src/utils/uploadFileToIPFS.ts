import { toast } from "react-toastify";
import { OPTIONS as toastOptions } from "utils/wrapWithToast";

export function uploadFileToIPFS(file: File): Promise<Response> {
  return toast.promise<Response, Error>(
    (async () => {
      const formData = new FormData();
      formData.append("file", file, file.name);

      console.log("File for upload:", file); // Debug log

      const url = "/.netlify/functions/uploadToIPFS?dapp=court&key=kleros-v2&operation=evidence";
      console.log("URL for upload:", url);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => ({ message: "Error uploading to IPFS" }));
        console.log("Error response:", errorResponse);

        throw new Error(errorResponse.message);
      }

      const responseJson = await response.json();
      console.log("Response JSON:", responseJson);

      return response;
    })(),
    {
      pending: "Uploading file to IPFS...",
      success: "Uploaded successfully!",
      error: {
        render({ data: error }) {
          console.error("Upload error:", error);
          return `Upload failed: ${error?.message}`;
        },
      },
    },
    toastOptions
  );
}
