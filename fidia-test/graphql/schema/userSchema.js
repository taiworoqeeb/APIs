const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String
        username: String!
        fullname: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
      }

      input UserInput {
        fullname: String!
        username: String!
        email: String!
        password: String!
      }
      type RootQuery {
        login(email: String!, password: String!): AuthData!
    }
    type RootMutation {
        createUser(userInput: UserInput): User
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }

`)