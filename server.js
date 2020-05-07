"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const app = express();

/*--- Import Files ---*/
const routes = require('./routes.js');
const auth = require('./auth.js');


/*--- Additional Dependencies ---*/
/*
const pug = require("pug");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
*/

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*--- Added by me ---*/
app.set("view engine", "pug");


/* ---------------------THESE FILES MOVED TO AUTH.JS------------------------ */
/*
// Init Express Session
app.use( // Moved to auth.js
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// Init Passport
app.use(passport.initialize()); // Moved to auth.js
app.use(passport.session()); // Moved to auth.js

// Setup query search for Mongo _id
const ObjectID = require('mongodb').ObjectID; // Moved to auth.js
*/

// Define MongoClient
const mongo = require('mongodb').MongoClient;

// Connect to MongoDB database
mongo.connect(process.env.DATABASE, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw new Error(err);
  
  console.log('Successful database connection.');
  const db = client.db('auth');

  // Connecting Routes.js and Auth.js
  auth(app,db);
  routes(app, db);
  
  app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port " + process.env.PORT);
  });
  
  /* ---------------------THESE FILES MOVED TO AUTH.JS------------------------ */
  /*
  // Serialize User
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize User
  passport.deserializeUser((id, done) => {
    db.collection("users").findOne({ _id: new ObjectID(id) }, (err,user) => {
      done(null, user);
    });
  }); 
  
  // User Authentication - Local Strategy
  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.collection('users').findOne({ username: username }, function (err, user) {
        console.log('User '+ username +' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));
  */

  
  /* ---------------------THESE FILES MOVED TO ROUTES.JS------------------------ */
  /*  
  // Ensure Authenticated Function
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };

 
  //---------------------ROUTE FILES------------------------//

  // Home Page Route - Passes variables to render on Home Page
  app.route("/")
    .get((req, res) => {
      res.render(process.cwd() + "/views/pug/index.pug", {
        title: 'Home Page',
        message: "Please login",
        showLogin: true,
        showRegistration: true
      });
  });

  // Login Route - Redirects to '/' if fails, otherwise '/profile'
  app.route("/login")
    .post(passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
      res.redirect('/profile');
  });
  
  // Logout Route
  app.route('/logout')
    .get((req,res) => {
      req.logout();
      res.redirect('/');
  });
  
  // Profile Route - Redirects to profile.pug and passes #{username}
  app.route("/profile")
    .get(ensureAuthenticated, (req, res) => {
      res.render(process.cwd() + "/views/pug/profile.pug", {
        username: req.user.username
      });
  });    
  
  // Register Route
  app.route('/register')
    .post((req, res, next) => {
      db.collection('users').findOne({ username: req.body.username }, function(err, user) {
        if (err) {
          next(err);
        } else if (user) {
          res.redirect('/');
        } else {
          let hash = bcrypt.hashSync(req.body.password, 12);
          db.collection('users').insertOne({
            username: req.body.username,
            password: hash
          },
            (err, doc) => {
              if (err) {
                res.redirect('/');
              } else {
                next(null, user);
              }
            }
          )
        }
      })
    },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );

  
  // 404 Page Route
  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });  

  */
   

});




