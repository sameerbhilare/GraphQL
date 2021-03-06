import { getAccessToken, isLoggedIn } from './auth';

const endpointUrl = 'http://localhost:9000/graphql';

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
  const query = `query JobQuery($id: ID!){
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

  const data = await graphqlRequest(query, { id });
  return data.job;
};

// fetch all jobs
export const loadJobs = async () => {
  const query = `
    {
        jobs {
            id
            title
            company {
                id
                name
            }
        }
    }`;

  const data = await graphqlRequest(query);
  return data.jobs;
};

// fetch single company
export const loadCompany = async (id) => {
  const query = `query CompanyQuery($id: ID!){
        company(id: $id) {
          id
          name
          description
          jobs {
            id
            title
          }
        }
      }`;

  const data = await graphqlRequest(query, { id });
  return data.company;
};

// create a new job
export const createJob = async (input) => {
  const mutation = `mutation CreateJob($input:CreateJobInput) {
        job: createJob(input: $input) {
          id
          title
          company {
            id
            name
          }
        }
      }`;

  const data = await graphqlRequest(mutation, { input });
  return data.job;
};
