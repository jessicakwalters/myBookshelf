//load express
const express = require('express');
const request = require('request');
//Instatiate express
const app = express();
//port
const PORT = process.env.PORT || 3000;

// eslint-disable-next-line no-template-curly-in-string
app.listen(PORT,() => console.log('Server listening on port ${PORT}'));

//directory
//app.use(express.static(__dirname + "/public"))

//view engine
app.set('view engine', 'ejs');

//ROUTES
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/books', (req, res) => {
  res.render('books');
});

//api key: AIzaSyA5JE35tB6R099TTZfDSPXdxQ-9y4OvC0g

app.get('/new', (req, res) => {
  let query = req.query.search;
  let url = 'https://www.googleapis.com/books/v1/volumes?q=' + query + '&orderBy=relevance&key=AIzaSyA5JE35tB6R099TTZfDSPXdxQ-9y4OvC0g';
  console.log(url);
  request(url, (error, response, body) => {
    // eslint-disable-next-line eqeqeq
    if(!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      res.render('new', {data: data});
    }
  });
});

app.get('/details', (req, res) => {
  let query = req.query.show_details;
  console.log(query);
  let url = 'https://www.googleapis.com/books/v1/volumes/' + query;
  console.log(url);
  request(url, (error, response, body) => {
    // eslint-disable-next-line eqeqeq
    if(!error && response.statusCode == 200) {
      let book = JSON.parse(body);
      res.render('details', {book: book});
    }
  });
});

