const middlewareObj = {};
const Book = require('../models/book');
const Note = require('../models/note');

middlewareObj.checkBookOwner = (req, res, next) => {
  if(req.isAuthenticated()){
    Book.findById(req.params.id, (err, foundBook) => {
      if(err){
        res.redirect('back');
      } else {
        if(foundBook.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkNoteOwner = (req, res, next) => {
  if(req.isAuthenticated()){
    Note.findById(req.params.note_id, (err, foundNote) => {
      if(err){
        res.redirect('back');
      } else {
        if(foundNote.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = middlewareObj;