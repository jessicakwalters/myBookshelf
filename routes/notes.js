const express = require('express');
const router = express.Router({mergeParams: true});
var Book = require('../models/book');
var Note = require('../models/note');
const User = require('../models/user');

//===================
//Notes Routes
//===================

//New
router.get('/new', isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    //ERRORS COMING BACK --> book undefined...hmmmm had to remove err handling
    //display book info
    if(err){
      console.log(err);
    } else {
      res.render('notes/new', {book: foundBook});
    }

  });
});

//Create
router.post('/', isLoggedIn, (req, res) => {
  //lookup book
  Book.findById(req.params.id, (err, book) => {
    if(err){
      console.log(err);
    } else {
      Note.create(req.body.note, (err, note) => {
        if(err){
          console.log(err);
        } else {
          //add username and id to comment
          note.author.id = req.user._id;
          note.author.username = req.user.username;
          note.save();
          book.notes.push(note);
          book.save();
          res.redirect('/books/' + book._id);
        }
      });
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