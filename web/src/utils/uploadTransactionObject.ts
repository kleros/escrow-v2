import { uploadFileToIPFS } from "./uploadFileToIPFS"

export const uploadTransactionObject = async (transactionDetails) => {
  const transactionJSON = new File([JSON.stringify(transactionDetails)], "transaction.json", {
    type: "application/json",
  });

  const formData = new FormData();
  formData.append("file", transactionJSON);

  try {
    const response = await uploadFileToIPFS(transactionJSON);
    const responseData = await response.json();
    console.log("Transaction object uploaded to IPFS with hash:", responseData.cids[0]);
    return responseData.cids[0];
  } catch (error) {
    console.error("Error uploading transaction object to IPFS:", error);
  }
};
