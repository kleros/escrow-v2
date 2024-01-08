import { uploadFileToIPFS } from "./uploadFileToIPFS";
import { uploadTransactionObject } from "./uploadTransactionObject";

export const handleFileUpload = async (
  escrowTitle: string,
  deliverableText: string,
  setIsFileUploading: (isFileUploading: boolean) => void,
  setExtraDescriptionUri: (extraDescriptionUri: string) => void,
  deliverableFile?: File
) => {
  try {
    setIsFileUploading(true);
    const transactionDetails = {
      title: escrowTitle,
      description: deliverableText,
    };
    setExtraDescriptionUri("");

    if (deliverableFile) {
      const fileResponse = await uploadFileToIPFS(deliverableFile);
      const fileData = await fileResponse.json();
      const fileHash = fileData.cids[0];
      transactionDetails.extraDescriptionUri = fileHash;
      setExtraDescriptionUri(fileHash);
    }

    const transactionObject = await uploadTransactionObject(transactionDetails);
    setIsFileUploading(false);
    return transactionObject;
  } catch (error) {
    console.error("Error in file upload process:", error);
    setIsFileUploading(false);
  }
};
