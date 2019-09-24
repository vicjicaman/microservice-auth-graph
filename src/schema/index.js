import * as Auth from './auth';
import * as Account from './account';

const {
  GraphQLDate,
  GraphQLDateTime
} = require('graphql-iso-date');

const schema = [...Account.schema,
  ...Auth.schema,
  `
  scalar DateTime
  scalar Date

  type Viewer {
    id: ID
    username: String
    account: AccountQueries
  }

  type ViewerMutations {
    id: ID
    username: String
    account: AccountMutations
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
  ...Account.resolvers,
  Viewer: {
    account: viewer => viewer.username ? viewer : null
  },
  ViewerMutations: {
    account: viewer => viewer.username ? viewer : null
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
