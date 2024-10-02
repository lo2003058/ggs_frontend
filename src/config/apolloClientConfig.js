import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
});

// Middleware to add the token to headers
const authLink = setContext((_, {headers}) => {
  // Get the token from localStorage (or another storage method)
  const token = JSON.parse(localStorage.getItem('token'));

  // Return the headers to the context, including the token if it exists
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain authLink and httpLink
  cache: new InMemoryCache(),
});

export default client;
