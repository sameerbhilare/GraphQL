const endpointUrl = 'http://localhost:9000/graphql';

// fetch single job
export const loadJob = async (id) => {
  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `query JobQuery($id: ID!){
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
      `,
      variables: { id: id },
    }),
  });

  const responseData = await response.json();
  return responseData.data.job;
};

// fetch all jobs
export const loadJobs = async () => {
  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
            jobs {
                id
                title
                company {
                    id
                    name
                }
            }
        }`,
    }),
  });

  const responseData = await response.json();
  return responseData.data.jobs;
};
