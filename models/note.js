const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  text: String,
  author: String
});

module.exports = mongoose.model('Note', noteSchema);