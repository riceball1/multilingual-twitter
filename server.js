// server.js
var Twit = require('twit');
var express = require('express');
var app = express();
var path = require('path');
var express = require('express');

var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


var T = new Twit({
  consumer_key:         'QnLFzUyAUAmlUe5xcN11tbxLL',
  consumer_secret:      'Q2ffUrLmj8hgyyYLlP0thuoXXaiuWXl9s5DQqlm47ByuiGecZa',
  access_token:         '2402049930-BKzuYbRdqCNjvPVNWgoEhKDXTKKS6G0nkRUXhim',
  access_token_secret:  'CH08Qfz1MnxVCizsqUnZfuBLEx4fnRkURa88DJnuu8g1H',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/:word', function (req, res) {
  T.get('search/tweets', { q: '#'+req.params.word, count: 100 }, function(err, data, response) {
    res.jsonp(data);
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
