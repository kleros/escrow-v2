import { errorToast, infoToast, successToast } from "./wrapWithToast";
import { Roles } from "@kleros/kleros-app";

type TransactionDetails = {
  title: string;
  description: string;
  extraDescriptionUri?: string;
};

export const handleFileUpload = async (
  uploadFile: (file: File, role: Roles) => Promise<string | null>,
  escrowTitle: string,
  deliverableText: string,
  setIsFileUploading: (isFileUploading: boolean) => void,
  setExtraDescriptionUri: (extraDescriptionUri: string) => void,
  deliverableFile?: File
) => {
  try {
    setIsFileUploading(true);
    infoToast("Uploading terms");
    const transactionDetails: TransactionDetails = {
      title: escrowTitle,
      description: deliverableText,
    };
    setExtraDescriptionUri("");

    if (deliverableFile) {
      if (deliverableFile.type !== "application/pdf") {
        errorToast("That type of file is not valid. Please upload a PDF file.");
        setIsFileUploading(false);
        return;
      }

      const fileHash = await uploadFile(deliverableFile, Roles.Policy);

      if (!fileHash) throw Error("Error uploading file.");

      transactionDetails.extraDescriptionUri = fileHash;
      setExtraDescriptionUri(fileHash);
    }

    const transactionJSON = new File([JSON.stringify(transactionDetails)], "transaction.json", {
      type: "application/json",
    });

    const transactionObjectHash = await uploadFile(transactionJSON, Roles.Policy);

    if (!transactionObjectHash) throw Error("Error uploading terms");

    successToast("Contract terms uploaded successfully.");
    setIsFileUploading(false);

    return transactionObjectHash;
  } catch (error) {
    console.error("Error in file upload process:", error);
    //@ts-ignore
    errorToast(`Upload failed: ${error?.message ?? "Unknown error"}`);
    setIsFileUploading(false);
    return null;
  }
};
