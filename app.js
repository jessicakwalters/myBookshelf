const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/book');
// eslint-disable-next-line no-unused-vars
const Note = require('./models/note');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/my_bookshelf");

app.listen(PORT,() => console.log('Server listening on port 3000'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

//ROUTES
app.get('/', (req, res) => {
  res.render('index');
});

//===================
//Book Routes
//===================

//INDEX
app.get('/books', (req, res) => {
  Book.find({}, (err, allBooks) => {
    if(err){
      console.log(err);
    } else {
      res.render('books/index', {books:allBooks});
    }
  });
});

//CREATE
app.post('/books', (req, res) => {
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
app.get('/books/:id', (req, res) => {
  //find book with  id
  //WHY IS THIS FUCKING BROKEN?! maybe try findOne?
  Book.findById(req.params.id).populate('notes').exec((err, foundBook) => {
   //ERRORS COMING BACK --> book undefined...hmmmm had to remove err handling
    //display book info
    res.render('books/show', {book: foundBook});
  });
});

//===================
//Search Routes
//===================

//INDEX
app.get('/search_results', (req, res) => {
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
app.get('/search_results/:id', (req, res) => {
  let url = 'https://www.googleapis.com/books/v1/volumes/' + req.params.id;
  console.log(url);
  request(url, (error, response, body) => {
    // eslint-disable-next-line eqeqeq
    //ERRORS COMING BACK --> book undefined...hmmmm had to remove err handling same as books show
    if(!error) {
      let book = JSON.parse(body);
      res.render('search/show', {book: book});
    }
  });
});

//===================
//Notes Routes
//===================

//New
app.get('/books/:id/notes/new', (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    //ERRORS COMING BACK --> book undefined...hmmmm had to remove err handling
    //display book info
    res.render('notes/new', {book: foundBook});
  });
});

app.post('/books/:id/notes', (req, res) => {
//lookup book
  Book.findById(req.params.id, (err, book) => {
    Note.create(req.body.note, (err, note) => {
      book.notes.push(note);
      book.save();
      res.redirect('/books/' + book._id);
    });
  });
});