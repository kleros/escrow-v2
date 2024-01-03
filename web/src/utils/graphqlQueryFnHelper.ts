import request from "graphql-request";
import { arbitrumSepolia } from "wagmi/chains";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

export const graphqlUrl = (chainId = arbitrumSepolia.id) => {
  const generalEscrowUrl =
    process.env.REACT_APP_ARBSEPOLIA_SUBGRAPH ?? "Wrong";
  return generalEscrowUrl;
};

export const graphqlQueryFnHelper = async (
  query: TypedDocumentNode<any, any>,
  parametersObject: Record<string, any>,
  chainId = arbitrumSepolia.id
) => {
  const url = graphqlUrl(chainId);
  return request(url, query, parametersObject);
};
