import * as Account from "Model/account";

const schema = [
  `
  type Account {
    id: ID
    username: String!
    name: String
    email: String!
    status: String!
    created_at: DateTime
  }


  type AccountQueries {
    get: Account!
  }

  type AccountMutations {
    validate(token: String!): Viewer!
    unregister: Boolean!
  }
`
];

const resolvers = {
  AccountQueries: {
    get: async (viewer, args, cxt) => await Account.get(viewer.username, cxt)
  },
  AccountMutations: {
    validate: async (viewer, { token }, cxt) =>
      await Account.validate(viewer, token, cxt),
    unregister: async (viewer, args, cxt) =>
      await Account.unregister(viewer, cxt)
  }
};

export { schema, resolvers };
