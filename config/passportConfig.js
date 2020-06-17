const { User } = require("../data/models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username })

      .then((user) => {
        if (user === null) {
          return done(null, false, { message: "Incorrect username." });
        }
        bcrypt.compare(password, user.password)
        .then((result) => {
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      })

      .catch((err) => done(err));
  })
);

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
})

module.exports = { passport };
