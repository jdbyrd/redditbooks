const request = require('request');
const db = require('../database');
const amazon = require('../helpers/amazonHelp');
const cron = require('node-cron');

cron.schedule('*/1 * * * *', function(){
  getRedditBooks();
});

let getRedditBooks = () => {
  getRedditLink()
  .then(getRedditComments)
  .then((list) => {
    Promise.all(list.map(db.searchTitle))
  });
}

let getRedditLink = () => {
  return new Promise ((resolve, reject) => {
    let options = {
      url: 'https://www.reddit.com/r/books',
      headers: {
        'User-Agent': 'request',
      }
    };
    request(options, (error, response, body) => {
      if(error) {
        reject(error);
      }else if(response) {
        let article = getLink(body);
        resolve(article);
      }
    });
  });
}

let getRedditComments = (article) => {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://redd.it/${article[0]}`,
      headers: {
        'User-Agent': 'request',
      }
    };
    request(options, (error, response, body) => {
      if(error) {
        reject(error);
      }else if(response) {
        let list = proccessComments(body);
        list.forEach((book) => {
          book[2] = article[1];
          //db.searchTitle(book, amazon.amazonRequest);
        });
        resolve(list);
      }
    });
  });
}

let getLink = (body) => {
  let index = body.indexOf(`">What Books Are You Reading This Week?`);
  let article = body.slice(index-6, index);
  body = body.slice(index+40);
  index = body.indexOf(`</a`);
  let date = body.slice(0, index);
  return [article, date];
}

let proccessComments = (body) => {
  let list = [];
  let index = body.indexOf(`<strong>`);

  while(index !== -1){
    body = body.slice(index + 8);
    index = body.indexOf('</strong>');
    let entry = body.slice(0, index);
    if(entry.indexOf(`, by `) !== -1){
      entry = entry.replace(`&#39;`, "");
      let tuple = entry.split(`, by `);
      list.push(tuple);
    }
    body = body.slice(index + 8);
    index = body.indexOf('<strong>');
  }
  return list.slice(1);
} 

module.exports.getRedditBooks = getRedditBooks;
module.exports.getRedditLink = getRedditLink;
module.exports.getRedditComments = getRedditComments;