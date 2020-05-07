const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const ObjectID = require("mongodb").ObjectID; // Setup query search for Mongo _id
const LocalStrategy = require("passport-local");

module.exports = function(app, db) {
  // Init Express Session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true
    })
  );

  // Init Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize User
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize User
  passport.deserializeUser((id, done) => {
    db.collection("users").findOne({ _id: new ObjectID(id) }, (err, user) => {
      done(null, user);
    });
  });

  // User Authentication - Local Strategy
  passport.use(
    new LocalStrategy(function(username, password, done) {
      db.collection("users").findOne({ username: username }, function(
        err,
        user
      ) {
        console.log("User " + username + " attempted to log in.");
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
};
