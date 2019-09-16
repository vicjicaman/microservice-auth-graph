import * as Account from "Model/account";

const schema = [
  ...Account.Schema,
  `
  type AccountQueries {
    get: Account!
  }
`
];

const resolvers = {
  AccountQueries: {
    get: async (viewer, { username }, cxt) =>
      await Account.Model.get(
        viewer,
        {
          username
        },
        cxt
      )
  }
};

export { schema, resolvers };
