const { ApolloServer, gql } = require('apollo-server'); // to parse the schema

// =======================================================
// DEFINE GRAPHQL SCHEMA
/*
    In a schema we always need at least this Query type, that contains all the possible queries
    that can be made by our clients when calling this server.

    "gql" is used to parse the schema. 
    It is a tag function, which means we can use it to tag a template literal.
    In other words we put "gql" before a backtick-delimited string.
    It makes it obvious that this is not just any regular string, 
    but it's a string that contains GraphQL code.

    According to below type definitions, clients can call this server and ask for a "greeting".
    That's the interface of our API.
*/
const typeDefs = gql`
  schema {
    query: Query
  }

  type Query {
    greeting: String
  }
`;

// This object represents an Abstract Syntax Tree, of the GraphQL code we wrote above.
// this is due to the parsing done by 'gql'
// console.log(typeDefs);

// =======================================================
// PROVIDE IMPLEMENTATION FOR ABOVE SCHEMA
/*
  This "resolvers" object needs to match the structure of our above type definitions precisely.
*/
const resolvers = {
  // represents a type defined in the schema
  Query: {
    /*      
    So this function will be called by the GraphQL engine every time a client sends a "greeting" query.
    Or, in other words, this function will be called to "resolve" the value of the "greeting" field.
    That's why in GraphQL jargon this is called a "resolver function".
    This "resolver function" can get the data from DB, etc.
    */
    greeting: () => 'Hello GraphQL World!',
  },
};

// =======================================================
// CREATE SERVER
/*
    We create the Apollo Server by passing the type definitions and their resolvers.
*/
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
// start listen
server.listen({ port: 9000 }).then((serverInfo) => {
  console.log(`Server running at ${serverInfo.url}`);
});
