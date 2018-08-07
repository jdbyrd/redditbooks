var mongoose = require('mongoose');
let mongoPass = process.env.mongoPwd || config.mongoPwd;
mongoose.connect(`mongodb://james:${mongoPass}@ds139067.mlab.com:39067/redditbooks`);
const amazon = require('../helpers/amazonHelp');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var listSchema = mongoose.Schema({
  reddittitle: String,
  author: String,
  title: String,
  url: String,
  img: String,
  date: String
});

var Book = mongoose.model('Books', listSchema);

var selectAll = function(callback) {
  Book.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

let search = (date, callback) => {
  Book.
  find().
  // where('date').equals(date).
  exec(callback);
};

let searchTitle = (book, callback) => {
  Book.find({reddittitle: book[0], date: book[2]}, (err, books) => {
    if(books.length){
      amazon.amazonRequest('Title already in list', null);
    } else { 
      amazon.amazonRequest(null, book);
    }
  });
}

let save = (book) => {
  console.log('SAVING THIS: ' + book);
  let newModel = new Book({author: book.author, title: book.title, url: book.url, img: book.img, reddittitle: book.reddittitle, date: book.date});
  newModel.save();
}

module.exports.search = search;
module.exports.selectAll = selectAll;
module.exports.searchTitle = searchTitle;
module.exports.save = save;