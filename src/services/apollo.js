import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GRAPHQL_URL, TOKEN_KEY } from "./api";

// Injeta o JWT em toda requisição GraphQL (o backend lê no context).
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN_KEY);
  return { headers: { ...headers, ...(token && { authorization: `Bearer ${token}` }) } };
});

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: GRAPHQL_URL })),
  cache: new InMemoryCache(),
});

export default client;
