const express = require('express');
const router = express.Router();
const request = require('request');
const User = require('../models/user');

//===================
//Search Routes
//===================

//INDEX
router.get('/', (req, res) => {
  let query = req.query.search;
  let url = 'https://www.googleapis.com/books/v1/volumes?q=' + query + '&orderBy=relevance&key=AIzaSyA5JE35tB6R099TTZfDSPXdxQ-9y4OvC0g';
  console.log(url);
  request(url, (error, response, body) => {
    // eslint-disable-next-line eqeqeq
    if(!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      res.render('search/index', {data: data});
    }
  });
});

//SHOW
router.get('/:id', (req, res) => {
  let url = 'https://www.googleapis.com/books/v1/volumes/' + req.params.id;
  console.log(url);
  request(url, (error, response, body) => {
    // eslint-disable-next-line eqeqeq
    //ERRORS COMING BACK --> book undefined...hmmmm had to remove err handling same as books show
    if(!error) {
      console.log(response.statusCode);
      let book = JSON.parse(body);
      res.render('search/show', {book: book});
    }
  });
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