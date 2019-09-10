import * as Account from 'Model/account'
const passport = require('passport')

const schema = [`

  type AuthMutations {
    register(username:String!, email: String!, password: String!): Account
    login(username:String!, password:String!): Account
    logout : Boolean
  }
`];



const authenticate = req =>
  new Promise((resolve, reject) => {

    passport.authenticate('local', function(err, user) {
      if (err) {
        reject(new Error(err));
        return;
      }

      if (!user) {
        resolve(null);
      } else {
        req.login(user, function(err) {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(user);
          }

        });
      }
    })(req)

  });





const resolvers = {
  AuthMutations: {
    register: async (root, {
      username,
      email,
      password
    }, cxt) => {

      const curr = await Account.Model.findOne({
        username
      });

      if (curr) {
        throw new Error("USER_EXISTS");
      }

      const added = new Account.Model({
        username,
        email,
        password
      });
      return await added.save();
    },
    login: async (root, {
      username,
      password
    }, cxt) => {

      cxt.request.body = {
        username,
        password
      };

      const res = await authenticate(cxt.request);
      console.log("UNREACHED")

      return res;
    },
    logout: (root, args, cxt) => {
      cxt.request.logout()
      return true;
    }
  },
};

export {
  schema,
  resolvers
}
