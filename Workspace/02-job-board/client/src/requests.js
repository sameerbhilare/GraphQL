const endpointUrl = 'http://localhost:9000/graphql';

// calling graphql endpoint (common)
const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables, // varibles (if any) to given query
    }),
  });

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
        }
      }`;

  const data = await graphqlRequest(query, { id });
  return data.company;
};
