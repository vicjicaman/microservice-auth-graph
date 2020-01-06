
export const login = (user, cxt) => {
  const { passport, request } = cxt;

  return new Promise((resolve, reject) => {
    request.login(user, function(err) {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(user);
      }
    })(user);
  });
};

export const authenticate = cxt => {
  const { passport, request } = cxt;

  return new Promise((resolve, reject) => {
    passport.authenticate("local", function(err, user) {
      if (err) {
        reject(new Error(err));
        return;
      }

      if (!user) {
        resolve(null);
      } else {
        request.login(user, function(err) {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(user);
          }
        });
      }
    })(request);
  });
};

export const logout = async cxt => cxt.request.logout();
