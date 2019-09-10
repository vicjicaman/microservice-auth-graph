import * as Account from 'Model/account'
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy


passport.serializeUser(function(user, cb) {
  cb(null, user.username)
})

passport.deserializeUser(function(username, cb) {
  Account.Model.findOne({
    username
  }).then(user => cb(null, user))
})

function init({
  app,
  client,
  host,
  port,
  secret
}) {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      Account.Model.findOne({
        username
      }).then((user, err) => {

        if (!user) {
          done(null, false)
          return;
        }

        bcrypt.compare(password, user.password,
          (err, isValid) => {
            if (err) {
              return done(err)
            }
            if (!isValid) {
              return done(null, false)
            }
            return done(null, user)
          });
      });
    }
  ));

  app.use(session({
    store: new RedisStore({
      host,
      port: parseInt(port),
      client,
      ttl: 260
    }),
    secret,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
}

export {
  init
}
