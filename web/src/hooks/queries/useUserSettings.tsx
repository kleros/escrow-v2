import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { isUndefined } from "utils/index";
import { OPTIONS } from "utils/wrapWithToast";

export const useUserSettings = () => {
  const authToken = sessionStorage.getItem("auth-token")?.replace(/"/g, "");
  const isEnabled = !isUndefined(authToken);

  return useQuery({
    queryKey: ["UserSettings"],
    enabled: isEnabled,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      try {
        if (!authToken) return;
        const res = await fetch("/.netlify/functions/fetch-settings", {
          method: "POST",
          headers: {
            "x-auth-token": authToken,
          },
        });

        return (await res.json())?.data as IUserSettings;
      } catch {
        toast.error("Error fetching User Settings!", OPTIONS);
        return {} as IUserSettings;
      }
    },
  });
};

export interface IUserSettings {
  address: `0x${string}`;
  email: string;
  telegram: string;
}
