// server.js
const dotenv = require('dotenv');
dotenv.load();

const Twit = require('twit');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret:process.env.ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/app", function (request, response) {
  response.sendFile(__dirname + '/views/app.html');
});

app.get('/:word', function (req, res) {
  T.get('search/tweets', { q: '#'+req.params.word, count: 100 }, function(err, data, response) {
    res.jsonp(data);
  });
});

var listener = app.listen(process.env.PORT || 8080, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
