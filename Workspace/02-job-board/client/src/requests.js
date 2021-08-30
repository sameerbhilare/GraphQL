import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import { getAccessToken, isLoggedIn } from './auth';

const endpointUrl = 'http://localhost:9000/graphql';

// "operation" is the GraphQL query or mutation to be executed
const authLink = new ApolloLink((operation, forward) => {
  // Add 'Authorization' header for logged in user
  // which will be used by the HttpLink when making the actual HTTP request
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        Authorization: 'Bearer ' + getAccessToken(),
      },
    });
  }
  // "forward' is a function that allows us to chain multiple steps together
  return forward(operation);
});

// create Apollo Client
const client = new ApolloClient({
  // how to connect to server
  link: ApolloLink.from([
    // add auth link before HttpLink so that 'authLink' will be executed first and then HttpLink
    authLink,

    // send request over HTTP
    new HttpLink({ uri: endpointUrl }),
  ]),

  // caching is one of main features of Apollo Client
  // there are many implementations of caching storage e.g. InMemoryCache, local storage, Async storage
  cache: new InMemoryCache(),
});

/* gql is a tag function. 
  It basically means that given template literal string will be processed by the gql function.
  This gql function does is effectively parsing this string into an object that represents the GraphQL query
  */
const jobQuery = gql`
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

// fetch single job
export const loadJob = async (id) => {
  const { data } = await client.query({ query: jobQuery, variables: { id } });
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

  /*
  While querying, we can pass fetchPolicy.
  cache-first - is default, means it will try getting the data from the cache first 
                and only if it doesn't find it in the cache then it will call the server.
  no-cache - means it will never use the cache it will always fetch the data from the server
  */
  const { data } = await client.query({ query: query, fetchPolicy: 'no-cache' });
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
        description
      }
    }
  `;

  // mutation
  const { data } = await client.mutate({
    mutation: mutation,
    variables: { input },
    // update is a function that will be called after the mutation has been executed
    // 1st arg is ref to 'cache' object and 2nd arg is mutation result
    update: (cache, mutationResult) => {
      console.log({ mutationResult });
      // the idea here is to save the data in the mutationResult to the cache
      // so that apollo client does not make a network request for a call on the job details page as soon as we navigate
      cache.writeQuery({
        query: jobQuery, // query for which 'data' to be saved
        variables: { id: mutationResult.data.job.id }, // arguments to the query
        data: mutationResult.data, // data to be saved
      });
    },
  });
  return data.job;
};
