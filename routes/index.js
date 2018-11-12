const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//ROOT
router.get('/', (req, res) => {
  res.render('landing');
});

//===================
//Auth Routes
//===================

//Show form
router.get('/register', (req, res) => {
  res.render('register');
});

//handle sign up
router.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('./books');
    });
  });
});

//===================
//Login Routes
//===================

//show login
router.get('/login', (req, res) => {
  res.render('login');
});

//login logic
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/books',
    failureRedirect: '/login'
  }), (req, res) => {
});

//logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/books');
});



//==================
//Middleware
//==================

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;