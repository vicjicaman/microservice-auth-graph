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
    id: ID
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

const getViewer = (cxt) => {
  const username = cxt.request.user ? cxt.request.user.username : null;
  return {
    id: username,
    username
  };
}

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  ...Auth.resolvers,
  ...Public.resolvers,
  ...Protected.resolvers,
  Viewer: {
    protected: viewer => viewer.username ? viewer : null
  },
  ViewerMutations: {
    protected: viewer => viewer.username ? viewer : null
  },
  Query: {
    viewer: (parent, args, cxt) => getViewer(cxt)
  },
  Mutation: {
    viewer: (parent, args, cxt) => getViewer(cxt),
    auth: parent => ({})
  }
};


export {
  schema,
  resolvers
}
