import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { graphql } from "src/graphql";
import { Escrow_Filter, OrderDirection } from "src/graphql/graphql";
import { useGraphqlBatcher } from "context/GraphqlBatcher";

export const transactionFragment = graphql(`
  fragment TransactionDetails on Escrow {
    id
    buyer
    seller
    transactionUri
    timestamp
    amount
    token
    deadline
    buyerFee
    sellerFee
    lastFeePaymentTime
    status
    transactionHash
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
    settlementProposals(orderBy: timestamp, orderDirection: asc) {
      id
      amount
      party
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
  const { graphqlBatcher } = useGraphqlBatcher();
  return useQuery({
    queryKey: ["refetchOnBlock", `useTransactionDetailsQuery`, transactionId],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: transactionDetailsQuery,
        variables: {
          id: transactionId,
        },
      }),
  });
};

export const useMyTransactionsQuery = (
  userAddress: Address,
  first = 9,
  skip = 0,
  where?: Escrow_Filter,
  orderDirection?: OrderDirection
) => {
  const { graphqlBatcher } = useGraphqlBatcher();
  return useQuery({
    queryKey: ["refetchOnBlock", "useMyTransactionsQuery", userAddress, first, skip, where, orderDirection],
    queryFn: async () =>
      await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: myTransactionsQuery,
        variables: {
          userAddress: userAddress.toLowerCase(),
          first,
          skip,
          where: where,
          orderDirection,
        },
      }),
  });
};
