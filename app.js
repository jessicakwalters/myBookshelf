const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/book');
const passport = require('passport');

const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');

const Note = require('./models/note');
const app = express();
const PORT = process.env.PORT || 3000;

const noteRoutes = require('./routes/notes');
const bookRoutes = require('./routes/books');
const searchRoutes = require('./routes/search');
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/my_bookshelf', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
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

app.use(indexRoutes);
app.use('/books', bookRoutes);
app.use('/search_results', searchRoutes);
app.use('/books/:id/notes', noteRoutes);

app.listen(PORT,() => console.log('Server listening on port 3000'));