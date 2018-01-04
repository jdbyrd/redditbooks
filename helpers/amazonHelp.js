const amazon = require('amazon-product-api');
const db = require('../database');
const config = require('../config.js');


let amazonRequest = (err, book) => {
  if(err){ console.log(err); }
  else {  
    var client = amazon.createClient({
      awsId: process.env.awsId ||`${config.awsId}`,
      awsSecret: process.env.awsSecret || `${config.awsSecret}`,
      awsTag: "redditbooks07-20"
    });

    client.itemSearch({
      title: book[0],
      author: book[1],
      searchIndex: 'Books',
      responseGroup: 'ItemAttributes,Offers,Images'
    }).then(function(results){
      let entry = {
        img: results[0].SmallImage[0].URL[0],
        url: results[0].DetailPageURL[0],
        title: results[0].ItemAttributes[0].Title[0],
        author: results[0].ItemAttributes[0].Author[0],
        reddittitle: book[0],
        date: book[2]
      };
      console.log(entry);
      db.save(entry);
    }).catch(function(err){
      console.log('error adding [' + book + '] using amazon api');
    });
  }
}

module.exports.amazonRequest = amazonRequest;