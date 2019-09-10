import * as Auth from './auth';
import * as Protected from './protected';
import * as Public from './public';
const {
  GraphQLDate,
  GraphQLDateTime
} = require('graphql-iso-date');

const schema = [...Protected.schema,
  ...Public.schema,
  ...Auth.schema,
  `
  scalar DateTime
  scalar Date

  type Viewer {
    username: String
    protected: ProtectedQueries
  }

  type ViewerMutations {
    username: String
    protected: ProtectedMutations
  }

  type Query {
    viewer: Viewer
  }

  type Mutation {
    auth: AuthMutations
    viewer: ViewerMutations
  }
`
];

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  ...Auth.resolvers,
  ...Public.resolvers,
  ...Protected.resolvers,
  Viewer: {
    protected: viewer => viewer
  },
  Query: {
    viewer: (parent, args, cxt) => cxt.request.user
  },
  Mutation: {
    viewer: (parent, args, cxt) => cxt.request.user,
    auth: parent => ({})
  }
};


export {
  schema,
  resolvers
}
