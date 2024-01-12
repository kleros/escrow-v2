import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { graphql } from "src/graphql";
import { graphqlQueryFnHelper } from "utils/graphqlQueryFnHelper";

export const transactionFragment = graphql(`
  fragment TransactionDetails on Escrow {
    id
    buyer
    seller
    transactionUri
    amount
    asset
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
`);

const myTransactionsQuery = graphql(`
  query MyTransactions($userAddress: Bytes!, $first: Int!, $skip: Int!) {
    escrows(first: $first, skip: $skip, where: { or: [{ buyer: $userAddress }, { seller: $userAddress }] }) {
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
    queryKey: [`useTransactionDetailsQuery`, transactionId],
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
