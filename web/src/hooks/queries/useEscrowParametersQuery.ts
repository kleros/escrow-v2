import { useQuery } from "@tanstack/react-query";
import { graphql } from "src/graphql";
import { graphqlQueryFnHelper } from "utils/graphqlQueryFnHelper";

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
  return useQuery({
    queryKey: ["useEscrowParametersQuery"],
    queryFn: async () => {
      try {
        const data = await graphqlQueryFnHelper(escrowParametersQuery, { id: "singleton" });
        return data;
      } catch (error) {
        console.error("Error fetching EscrowParameters:", error);
        throw new Error("Error fetching EscrowParameters");
      }
    },
  });
};
