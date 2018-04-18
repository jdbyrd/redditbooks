var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database');
const reddit = require('../helpers/redditHelp');

var app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.get('/books', function (req, res) {
  reddit.getRedditLink()
  .then(article => {
    db.search(article[1], (err, repo)=>{
      if (err) return handleError(err);
      res.json(repo);
    });
  });
});

let port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

