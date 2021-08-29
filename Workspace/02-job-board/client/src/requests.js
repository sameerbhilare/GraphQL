const endpointUrl = 'http://localhost:9000/graphql';

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
