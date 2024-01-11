import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { graphql } from "src/graphql";
import { graphqlQueryFnHelper } from "utils/graphqlQueryFnHelper";

const userQuery = graphql(`
  query User($userId: ID!) {
    user(id: $userId) {
      totalEscrows
      totalResolvedEscrows
    }
  }
`);

export const useUserQuery = (userId: Address) => {
  return useQuery({
    queryKey: [`useUserQuery`, userId],
    queryFn: async () => {
      try {
        const data = await graphqlQueryFnHelper(userQuery, {
          userId: userId.toLowerCase(),
        });
        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw new Error("Error fetching user data");
      }
    },
  });
};
