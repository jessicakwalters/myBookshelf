const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/user');
const middleware = require('../middleware');



//===================
//Book Routes
//===================

//INDEX - all books
router.get('/', (req, res) => {
  Book.find({}, (err, allBooks) => {
    if(err){
      console.log(err);
    } else {
      res.render('books/index', {books:allBooks});
    }
  });
});

//CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
  //get data from form
  let title = req.body.title;
  let book_author = req.body.author;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newBook = {title: title, book_author: book_author, image: image, description: description, author: author};
  //create a new campground and save to db
  // eslint-disable-next-line no-unused-vars
  Book.create(newBook, (err, newlyCreated) => {
    if (err){
      console.log(err);
      console.log(newBook);
    } else {
      //redirect to books page;
      console.log(newlyCreated);
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
      console.log(err);
    } else {
      console.log(foundBook);
      res.render('books/show', {book: foundBook});
    }
  });
});

//EDIT
router.get('/:id/edit', middleware.checkBookOwner, (req, res) => {
  //permissions
  Book.findById(req.params.id, (err, foundBook) => {
    res.render('books/edit', {book: foundBook});
  });
});

//UPDATE
router.put('/:id', middleware.checkBookOwner, (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body.book, (err, updatedBook) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/books/' + req.params.id);
    }
  });
});

//DESTROY
router.delete('/:id', middleware.checkBookOwner, (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err) => {
    if (err){
      console.log(err);
    } else {
      res.redirect('/books');
    }
  });
});



module.exports = router;