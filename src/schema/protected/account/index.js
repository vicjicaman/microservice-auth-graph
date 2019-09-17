import * as Account from "Model/account";

const schema = [
  ...Account.Schema,
  `
  type AccountQueries {
    get: Account!
  }

  type AccountMutations {
    unregister: Boolean!
  }
`
];

const resolvers = {
  AccountQueries: {
    get: async (viewer, args, cxt) =>
      await Account.Model.get(viewer, { username: viewer.username }, cxt)
  },
  AccountMutations: {
    unregister: async (viewer, args, cxt) =>
      await Account.Model.unregister(viewer, args, cxt)
  }
};

export { schema, resolvers };
