import { toast, ToastPosition, Theme } from "react-toastify";
import { PublicClient, TransactionReceipt } from "viem";

export const OPTIONS = {
  position: "top-center" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as Theme,
};

export const infoToast = (message: string) => toast.info(message, OPTIONS);
export const successToast = (message: string) => toast.success(message, OPTIONS);
export const errorToast = (message: string) => toast.error(message, OPTIONS);

type WrapWithToastReturnType = {
  status: boolean;
  result?: TransactionReceipt;
};

export async function wrapWithToast(
  contractWrite: () => Promise<`0x${string}`>,
  publicClient: PublicClient
): Promise<WrapWithToastReturnType> {
  infoToast("Transaction initiated");
  return await contractWrite()
    .then(
      async (hash) =>
        await publicClient.waitForTransactionReceipt({ hash, confirmations: 2 }).then((res: TransactionReceipt) => {
          const status = res.status === "success";

          if (status) successToast("Transaction mined!");
          else errorToast("Transaction reverted!");

          return { status, result: res };
        })
    )
    .catch((error) => {
      errorToast(error.shortMessage ?? error.message);
      return { status: false };
    });
}

export async function catchShortMessage(promise: Promise<any>) {
  return await promise.catch((error) => errorToast(error.shortMessage ?? error.message));
}
