import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import { getAccessToken, isLoggedIn } from './auth';

const endpointUrl = 'http://localhost:9000/graphql';

// create Apollo Client
const client = new ApolloClient({
  // how to connect to server
  link: new HttpLink({ uri: endpointUrl }),

  // caching is one of main features of Apollo Client
  // there are many implementations of caching storage e.g. InMemoryCache, local storage, Async storage
  cache: new InMemoryCache(),
});

// calling graphql endpoint (common)
const graphqlRequest = async (query, variables = {}) => {
  const request = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables, // varibles (if any) to given query
    }),
  };

  // Add 'Authorization' header for logged in user
  if (isLoggedIn()) {
    request.headers['Authorization'] = 'Bearer ' + getAccessToken();
  }

  const response = await fetch(endpointUrl, request);

  const responseData = await response.json();
  if (responseData.errors) {
    const message = responseData.errors.map((err) => err.message).join('\n');
    throw new Error(message);
  }
  return responseData.data;
};

// fetch single job
export const loadJob = async (id) => {
  /* gql is a tag function. 
  It basically means that given template literal string will be processed by the gql function.
  This gql function does is effectively parsing this string into an object that represents the GraphQL query
  */
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;

  const { data } = await client.query({ query: query, variables: { id } });
  return data.job;
};

// fetch all jobs
export const loadJobs = async () => {
  /* gql is a tag function. 
  It basically means that given template literal string will be processed by the gql function.
  This gql function does is effectively parsing this string into an object that represents the GraphQL query
  */
  const query = gql`
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await client.query({ query: query });
  return data.jobs;
};

// fetch single company
export const loadCompany = async (id) => {
  /* gql is a tag function. 
  It basically means that given template literal string will be processed by the gql function.
  This gql function does is effectively parsing this string into an object that represents the GraphQL query
  */
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;

  const { data } = await client.query({ query: query, variables: { id } });
  return data.company;
};

// create a new job
export const createJob = async (input) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await client.mutate({ mutation: mutation, variables: { input } });
  return data.job;
};
