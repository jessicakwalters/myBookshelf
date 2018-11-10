const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/book');
const passport = require('passport');

const LocalStrategy = require('passport-local');
const User = require('./models/user');

// eslint-disable-next-line no-unused-vars
const Note = require('./models/note');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/my_bookshelf', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//passport config
app.use(require('express-session')({
  secret: 'My Bookshelf is Empty',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//make user available
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

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
      res.render('books/index', {books:allBooks, currentUser: req.user});
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
      console.log(response.statusCode);
      let book = JSON.parse(body);
      res.render('search/show', {book: book});
    } 
  });
});

//===================
//Notes Routes
//===================

//New
app.get('/books/:id/notes/new', isLoggedIn, (req, res) => {
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

app.post('/books/:id/notes', isLoggedIn, (req, res) => {
//lookup book
  Book.findById(req.params.id, (err, book) => {
    if(err){
      console.log(err);
    } else {
      Note.create(req.body.note, (err, note) => {
        if(err){
          console.log(err);
        } else {
          book.notes.push(note);
          book.save();
          res.redirect('/books/' + book._id);
        }
      });
    }
  });
});

//===================
//Auth Routes
//===================

//Show form
app.get('/register', (req, res) => {
  res.render('register');
});

//handle sign up
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
});

//login logic
app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/books',
    failureRedirect: '/login'
  }), (req, res) => {
});

//logout
app.get('/logout', (req, res) => {
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
app.listen(PORT,() => console.log('Server listening on port 3000'));