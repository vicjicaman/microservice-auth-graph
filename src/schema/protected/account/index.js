import * as Account from 'Model/account'

const schema = [...Account.Schema, `
  type AccountQueries {
    get: Account!
  }
`];

const resolvers = {
  AccountQueries: {
    get: async ({
      username
    }, args, cxt) => await Account.Model.findOne({
      username
    })
  },
};

export {
  schema,
  resolvers
}
