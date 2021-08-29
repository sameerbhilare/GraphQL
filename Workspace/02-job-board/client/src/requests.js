const endpointUrl = 'http://localhost:9000/graphql';

const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseData = await response.json();
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
