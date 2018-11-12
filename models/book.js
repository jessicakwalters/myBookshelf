const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  book_author: String,
  image: String,
  description: String,
  author: [
    {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
      username: String,
    },
  ],
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
});

module.exports = mongoose.model('Book', bookSchema);