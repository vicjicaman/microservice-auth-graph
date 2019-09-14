import * as Account from './account';

const schema = [...Account.schema,`

  type ProtectedQueries {
    account: AccountQueries
  }

  type ProtectedMutations {
    dummy: String
  }

`];

const resolvers = {
  ...Account.resolvers,
  ProtectedQueries: {
    account: async viewer => viewer
  }
};

export {
  schema,
  resolvers
}
