import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { graphql } from "src/graphql";
import { graphqlQueryFnHelper } from "utils/graphqlQueryFnHelper";
import { Escrow_Filter, OrderDirection } from "src/graphql/graphql";

export const transactionFragment = graphql(`
  fragment TransactionDetails on Escrow {
    id
    buyer
    seller
    transactionUri
    timestamp
    amount
    asset
    deadline
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
      timestamp
    }
    hasToPayFees {
      id
      party
      timestamp
    }
    createdEvents {
      id
    }
    resolvedEvents {
      id
      resolution
      timestamp
    }
    disputeRequest {
      id
      from
      escrow {
        id
      }
      timestamp
    }
  }
`);

const myTransactionsQuery = graphql(`
  query MyTransactions(
    $userAddress: Bytes!
    $first: Int!
    $skip: Int!
    $where: Escrow_filter
    $orderDirection: OrderDirection
  ) {
    escrows(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: $orderDirection
      where: { and: [{ or: [{ buyer: $userAddress }, { seller: $userAddress }] }, $where] }
    ) {
      ...TransactionDetails
    }
  }
`);

const transactionDetailsQuery = graphql(`
  query TransactionDetails($id: ID!) {
    escrow(id: $id) {
      ...TransactionDetails
    }
  }
`);

export const useTransactionDetailsQuery = (transactionId) => {
  return useQuery({
    queryKey: ["refetchOnBlock", `useTransactionDetailsQuery`, transactionId],
    queryFn: async () => {
      try {
        const data = await graphqlQueryFnHelper(transactionDetailsQuery, {
          id: transactionId,
        });
        return data;
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        throw new Error("Error fetching transaction details");
      }
    },
  });
};

export const useMyTransactionsQuery = (
  userAddress: Address,
  first = 9,
  skip = 0,
  where?: Escrow_Filter,
  orderDirection?: OrderDirection
) => {
  return useQuery({
    queryKey: ["useMyTransactionsQuery", userAddress, first, skip, where, orderDirection],
    queryFn: async () => {
      try {
        const data = await graphqlQueryFnHelper(myTransactionsQuery, {
          userAddress: userAddress.toLowerCase(),
          first,
          skip,
          where: where,
          orderDirection,
        });
        return data;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Error fetching transactions");
      }
    },
  });
};
