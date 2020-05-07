const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (app, db) {
  
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
  
  
}