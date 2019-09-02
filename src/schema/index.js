var {
  schema: UserSchema,
  resolvers: UserResolvers
} = require('./user');

const schema = [...UserSchema, `
  type Query {
    users: UserQueries
  }
`];

const resolvers = {
  ...UserResolvers,
  Query: {
    users: (root, args, cxt) => {
      return {};
    }
  },
};


module.exports.schema = schema;
module.exports.resolvers = resolvers;
