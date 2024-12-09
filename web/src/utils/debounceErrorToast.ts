import { errorToast } from "utils/wrapWithToast";

let timeoutId: NodeJS.Timeout;
export const debounceErrorToast = (msg: string) => {
  if (timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    errorToast(msg);
  }, 5000);
};
