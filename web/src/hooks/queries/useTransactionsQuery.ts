import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { graphql } from "src/graphql";
import { graphqlQueryFnHelper } from "utils/graphqlQueryFnHelper";

const myTransactionsQuery = graphql(`
  query MyTransactions($userAddress: Bytes!, $first: Int!, $skip: Int!) {
    escrows(first: $first, skip: $skip, where: { or: [{ buyer: $userAddress }, { seller: $userAddress }] }) {
      id
      buyer
      seller
      amount
      deadline
      disputeID
      buyerFee
      sellerFee
      lastFeePaymentTime
      templateData
      templateDataMappings
      status
      payments {
        id
        amount
        party
      }
      hasToPayFees {
        id
        party
      }
      createdEvents {
        id
      }
      resolvedEvents {
        id
        resolution
      }
    }
  }
`);

export const useMyTransactionsQuery = (userAddress: Address, first = 10, skip = 0) => {
  return useQuery({
    queryKey: [`useMyTransactionsQuery`, userAddress, first, skip],
    queryFn: async () => {
      try {
        const data = await graphqlQueryFnHelper(myTransactionsQuery, {
          userAddress: userAddress.toLowerCase(),
          first,
          skip,
        });
        return data;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Error fetching transactions");
      }
    },
  });
};
