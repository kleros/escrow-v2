import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { graphql } from "src/graphql";
import { useGraphqlBatcher } from "context/GraphqlBatcher";

const userQuery = graphql(`
  query User($userId: ID!) {
    user(id: $userId) {
      totalEscrows
      totalResolvedEscrows
      totalNoDisputedEscrows
      totalDisputedEscrows
      totalWaitingBuyerEscrows
      totalWaitingSellerEscrows
    }
  }
`);

export const useUserQuery = (userId: Address) => {
  const { graphqlBatcher } = useGraphqlBatcher();
  return useQuery({
    queryKey: [`useUserQuery`, userId],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: userQuery,
        variables: {
          userId: userId.toLowerCase(),
        },
      }),
  });
};
