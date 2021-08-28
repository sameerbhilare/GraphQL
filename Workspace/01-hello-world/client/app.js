// fetch 'greeting' from server.
const graphqlUrl = 'http://localhost:9000/';

const fetchGreeting = async () => {
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
            greeting
        }`,
    }),
  });

  const { data } = await response.json();
  console.log(data);
  return data;
};

fetchGreeting().then((data) => {
  const title = document.querySelector('h1');
  title.textContent = data.greeting;
});
