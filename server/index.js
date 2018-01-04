const express = require('express')
const app = express()
const db = require('../database');
const reddit = require('../helpers/redditHelp');

app.get('/books', function (req, res) {
  reddit.getRedditLink()
  .then(article => {
    db.search(article[1], (err, repo)=>{
      if (err) return handleError(err);
      res.json(repo);
    });
  });
});

let port = process.env.PORT || 300;

app.listen(port, () => console.log(`redditbooks server listenening on ${port}`));