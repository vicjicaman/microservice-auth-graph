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

const login = (passport, req, user) =>
  new Promise((resolve, reject) => {
    req.login(user, function(err) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(user);
      }
    })(user);
  });

const authenticate = (passport, req) =>
  new Promise((resolve, reject) => {
    passport.authenticate("local", function(err, user) {
      if (err) {
        reject(new Error(err));
        return;
      }

      if (!user) {
        resolve(null);
      } else {
        req.login(user, function(err) {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(user);
          }
        });
      }
    })(req);
  });

const resolvers = {
  AuthMutations: {
    register: async (viewer, { username, email, password }, cxt) => {
      const curr = await Account.Model.get(
        viewer,
        {
          username
        },
        cxt
      );

      if (curr) {
        throw new Error("USER_EXISTS");
      }

      const registered = await Account.Model.register(
        viewer,
        {
          username,
          email,
          password
        },
        cxt
      );
      return await login(cxt.passport, cxt.request, registered);
    },
    login: async (root, { username, password }, cxt) => {
      cxt.request.body = {
        username,
        password
      };

      const res = await authenticate(cxt.passport, cxt.request);
      return res;
    },
    logout: (root, args, cxt) => {
      cxt.request.logout();
      return true;
    }
  }
};

export { schema, resolvers };
