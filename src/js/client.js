"use strict";
var TWITTER_BASE_URL = 'https://morning-ravine-82145.herokuapp.com/';
// TWITTER_BASE_URL = 'https://picayune-basement.gomix.me/'; If debugging server.js on gomix. 
var YANDEX_TRANSLATE_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
var YANDEX_KEY = 'trnsl.1.1.20161212T153919Z.2c641cfa919addd2.4255914407af1a02e8559664527d9d96260beeca';

var state = {
  searchTerm: '',
  tweetLimit: 0,
  tweetsArray: [],
  translatedTweetsArray: []
};

function tweeterList() {

  function showSearchDisplay() {
    $('.language-choice').css('display', 'none');
    $('.tweet-list').removeClass('hidden');
    $('.tools').removeClass('hidden');
  }

  function setSearchState(state){
    state.searchTerm = $('#twitter-keyword-entry').val();
    state.tweetLimit = $('#limitTweeterItems').val();
  }

  function submitSearch(event){
    event.preventDefault();
    setSearchState(state);
    showSearchDisplay();
    getDataFromTwitter(state);
  }

  function getDataFromTwitter(state) {
    $.ajax({
      url: TWITTER_BASE_URL + state.searchTerm,
      dataType: 'jsonp',
      success: function(data) {
        displayTweetData(data);
      },
      type: 'GET'
    });
  }

  function displayTweetData(data) {
    var resultElement = '';
    if(data.statuses.length == 0) {
      resultElement += "<p>Search did not find anything.</p>";
    } else {
      for(var i = 0; i < state.tweetLimit; i++) {
        var individualTweets = data.statuses[i];
        var tweetTextNormal = individualTweets.text;
        var language = individualTweets.metadata.iso_language_code;
        var userInfo = individualTweets.user;
        state.tweetsArray.push(tweetTextNormal);

        var author = userInfo.name;
        var username = userInfo.screen_name;
        var avatar = userInfo.profile_image_url;
        var time = userInfo.created_at;
        var timestamp = time.replace(time.slice(16,25), '');
        var tweetLink = individualTweets.id_str;

        resultElement += 
        '<div class="individual-tweets"' + 'data-lang="' + language + '" data-index="' + i +'">'+ 
          '<div class="authorInfo">'+
            '<a href="https://www.twitter.com/'+username+'" target="_blank">'+
              '<img src="' + avatar + '" class="avatar">'+
              '</a>' + 
            '<a href="https://www.twitter.com/'+username+'" target="_blank">'+
              '<span class="authorName">'+ author +' </span>' +
              '<span class="authorHandle">@' + username+ ' </span>' +
            '</a>'
            + '<span class="timestamp">' + timestamp + '</span>'+
          '</div>' + 
          '<div class="tweetContent">'+
            '<p class="tweetText">'+ tweetTextNormal + '</p>'+
            '<a href="#" class="js-toggle-languages action"> Toggle Original/Translated Language </a>'+ 
            '<a href="https://www.twitter.com/statuses/'+ tweetLink +'" target="_blank" class="action"> View on Twitter </a>'+ 
            '<a class="twitter-share-button"> Tweet </a>'+
          '</div>'+
        '</div>';
      }
    }
    $('.individual-tweets-list').html(resultElement);
  }

  function getDataFromYandex(text, language, index) {
    $.ajax({
      url: YANDEX_TRANSLATE_URL,
      dataType: 'json',
      data:{
        key: YANDEX_KEY,
        lang: language,
        text: text,
      },
      success: function(data){
        var tweetResponse = data.text[0];
        state.translatedTweetsArray[index] = tweetResponse;//translated text
        $('.tweetText:eq('+index+')').html(tweetResponse);
      },
      type: 'GET',
      ui: language,
      format: "html",
      error: function(error) {
        console.log(this.url);
        console.log(error);
      }
    });
  }

  /** EVENT LISTENERS**/
  // watch for click on submit button
  $('.js-submit-search').on('click', function(event) {
    submitSearch(event);
  });
  // watch for enter on keyword
  $('.js-submit-search').on('keypress', function(event) {
    if(event.key === 13) {
      submitSearch(event);
    }
  });

  // select language and immediately translate all tweets
  $('.dropdown-content').on('click', 'option', function(event) {
    var language = $(this).val();
    var languageName = $(this).text();
    $('.language-choice').css('display', 'block');
    $('.language-choice').html(languageName);
    translateTweets(state, language);
  });
  
  function translateTweets(state, language){
    for(var i= 0; i < state.tweetLimit; i++) {
      var text = state.tweetsArray[i];
      getDataFromYandex(text, language, i);
    }
  }
    
  // toggle between translation and original text
  $('.individual-tweets-list').on('click', '.js-toggle-languages', function(event){
    event.preventDefault();
    var index = $(this).parent().parent().attr('data-index');
    var currentTweetText = $(this).parent().find('.tweetText').text();
    if(state.tweetsArray[index] != currentTweetText) {
      $('.tweetText:eq('+index+')').text(state.tweetsArray[index]);
    } else {
      $('.tweetText:eq('+index+')').text(state.translatedTweetsArray[index]);
    }
  });
  
  // tweet out correct current tweet text
  $('.individual-tweets-list').on('click', '.twitter-share-button', function(event){
    event.preventDefault();
    var currentTweetText = $(this).parent().find('.tweetText').text();
    var encodedTweetText = encodeURIComponent(currentTweetText);
    var twitterURL = "https://twitter.com/intent/tweet?text=" + encodedTweetText;
    $(this).attr('href', twitterURL )
  });
}

$(document).ready(tweeterList);