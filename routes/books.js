const express = require('express');
const router = express.Router();
var Book = require('../models/book');
const User = require('../models/user');


//===================
//Book Routes
//===================

//INDEX
router.get('/', (req, res) => {

  Book.find({}, (err, allBooks) => {
    if(err){
      console.log(err);
    } else {
      res.render('books/index', {books:allBooks, currentUser: req.user});
    }
  });
});

//CREATE
router.post('/', (req, res) => {
  //get data from form
  let title = req.body.title;
  let author = req.body.author;
  let image = req.body.image;
  let description = req.body.description;
  let newBook = {title: title, author: author, image: image, description: description};
  //create a new campground and save to db
  // eslint-disable-next-line no-unused-vars
  Book.create(newBook, (err, newlyCreated) => {
    if (err){
      console.log(err);
      console.log(newBook);
    } else {
      //redirect to books page;
      res.redirect('/books');
    }
  });
});

//SHOW
router.get('/:id', (req, res) => {
  //find book with  id
  //WHY IS THIS FUCKING BROKEN?! maybe try findOne?
  Book.findById(req.params.id).populate('notes').exec((err, foundBook) => {
    //ERRORS COMING BACK --> book undefined...hmmmm had to remove err handling
    //display book info
    if(err){
      console.log('error');
    } else {
      console.log(foundBook);
      res.render('books/show', {book: foundBook});
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