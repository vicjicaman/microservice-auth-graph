import * as Account from "Model/account";

const schema = [
  `

  type AuthMutations {
    register(username:String!, email: String!, password: String!): Account
    login(username:String!, password:String!): Account
    logout : Boolean
  }
`
];

const resolvers = {
  AuthMutations: {
    register: async (viewer, { username, password, email }, cxt) =>
      await Account.register({ username, password, email }, cxt),
    login: async (root, { username, password }, cxt) => {
      cxt.request.body = {
        username,
        password
      };

      return await Account.login(cxt);
    },
    logout: (root, args, cxt) => {
      return Account.logout(cxt);
    }
  }
};

export { schema, resolvers };
