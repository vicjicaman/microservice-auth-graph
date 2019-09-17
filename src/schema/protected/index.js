import * as Account from "./account";

const schema = [
  ...Account.schema,
  `

  type ProtectedQueries {
    account: AccountQueries
  }

  type ProtectedMutations {
    account: AccountMutations
  }

`
];

const resolvers = {
  ...Account.resolvers,
  ProtectedQueries: {
    account: async viewer => viewer
  },
  ProtectedMutations: {
    account: async viewer => viewer
  }
};

export { schema, resolvers };
