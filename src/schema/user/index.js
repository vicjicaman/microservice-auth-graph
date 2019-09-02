var {list} = require('../../model/user')

const schema = [`

  type User {
    email: String
  }

  type UserQueries {
    list: [User]!
  }
`];

const resolvers = {
  UserQueries: {
    list: async (root, args, cxt) => await list()
  },
};

module.exports.schema = schema;
module.exports.resolvers = resolvers;
