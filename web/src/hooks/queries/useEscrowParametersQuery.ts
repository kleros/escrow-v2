import { useQuery } from "@tanstack/react-query";
import { graphql } from "src/graphql";
import { useGraphqlBatcher } from "context/GraphqlBatcher";

const escrowParametersQuery = graphql`
  query EscrowParametersDetails($id: ID!) {
    escrowParameters(id: $id) {
      id
      feeTimeout
      settlementTimeout
      arbitratorExtraData
    }
  }
`;

export const useEscrowParametersQuery = () => {
  const { graphqlBatcher } = useGraphqlBatcher();
  return useQuery({
    queryKey: ["useEscrowParametersQuery"],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: escrowParametersQuery,
        variables: { id: "singleton" },
      }),
  });
};
