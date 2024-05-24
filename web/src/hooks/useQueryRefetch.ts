import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 *
 * @required This hook needs to be used within the QueryClientProvider
 * @param queryKeys An Array of Query  :   [ [ "key1" ], [ "key2" ] ]
 * @param waitFor Optional - Time to wait before refetching
 * @returns refetchQuery - A function that takes in the query keys array to refetch
 * @example refetchQuery([["refetchOnBlock","myQuery"],["myOtherQuery"]])
 * @warning The order of keys in the query key array matters
 */
export const useQueryRefetch = () => {
  const queryClient = useQueryClient();

  const refetchQuery = useCallback(
    async (queryKeys: string[][], waitFor = 4000) => {
      await new Promise((res) => setTimeout(() => res(true), waitFor));

      for (const queryKey of queryKeys) {
        queryClient.refetchQueries(queryKey);
      }
    },
    [queryClient]
  );

  return refetchQuery;
};
