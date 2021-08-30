const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { Query, Job, Company, Mutation } = require('./resolvers');

const port = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();

app.use(
  cors(),
  bodyParser.json(),

  // if the request contains a valid token this middleware will set 'req.user'
  // to contain the information decoded from the token.
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
  })
);

// declare schema
const typeDefs = gql(fs.readFileSync('./schema.graphql', { encoding: 'utf-8' }));
//console.log(typeDefs);

// define resolvers
const resolvers = { Query, Job, Company, Mutation };
//console.log(resolvers);

const context = ({ req }) => ({
  // here we can extract any information we're interested in from the HTTP request
  // and make it available in the 'context' visible to our resolvers.
  user: req.user && db.users.get(req.user.sub), // req.user is set by 'expressJwt' above
});
// define apollo server
const apolloServer = new ApolloServer({ typeDefs, resolvers, context: context });

// plug-in apollo server to existing express server
apolloServer.applyMiddleware({ app, path: '/graphql' }); // by default path: '/graphql'

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

app.listen(port, () => console.info(`Server started on port ${port}`));
