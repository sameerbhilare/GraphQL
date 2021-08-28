const { gql } = require('apollo-server'); // to parse the schema

// Define GraphQL schema
/*
    In a schema we always need at least this Query type, that contains all the possible queries
    that can be made by our clients when calling this server.

    "gql" is used to parse the schema. 
    It is a tag function, which means we can use it to tag a template literal.
    In other words we put "gql" before a backtick-delimited string.
    It makes it obvious that this is not just any regular string, 
    but it's a string that contains GraphQL code.
*/
const typeDefs = gql`
  type Query {
    greeting: String
  }
`;

// This object represents an Abstract Syntax Tree, of the GraphQL code we wrote above.
// this is due to the parsing done by 'gql'
// console.log(typeDefs);
