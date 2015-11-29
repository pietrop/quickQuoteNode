// to export to twitter video API
//Dan's version, needs refactoring
// TODO: should take in video file name and src; 
// text to post in body of tweet. 
// autenthicate the application
// autenthicate the user
//TODO: To tweet on behalf of user, needs passportjs twitter auth strategy.


var fs = require('fs');
var MediaUpload = require('twitter-media');
var Twit = require('twit');
var User = require('lib/models');
//loading ENV variables
//TODO: figure out if maybe is better design for config and credentials needs to be passed as argument to function?
// var config = require('../../../../config.js');
var config = require('config.js');

var credentials = {
  consumer_key:     config.twitter.consumer_key,
  consumer_secret:  config.twitter.consumer_secret,
  token:            config.twitter.token,
  token_secret:     config.twitter.token_secret
};

//TODO find the user, and 

var T = new Twit({
  consumer_key: credentials.consumer_key,
  consumer_secret: credentials.consumer_secret,
  access_token: credentials.token,
  access_token_secret: credentials.token_secret
});

var tweet_video = function(text,videoFile){

  var video = fs.readFileSync(videoFile);
  var upload = new MediaUpload(credentials);

  //making credentials users specific, to tweet on behalf of a user.

  // T.setAuth({
  //   access_token: User.token,
  //   access_token_secret:User.tokenSecret
  // });

  upload.uploadMedia('video', video, function(err, id_media, res){

    T.post('statuses/update', {status: text, media_ids: [res.media_id_string]}, function(err, data){
      console.log("tweet posted");
      console.log(err, data);
    });
  });

}

// ////to test function
// var status     =   "Testing Twitter Video API";
// var videoFile  =   "debate_test_trimmed.mp4";
// tweet_video(status, videoFile);

module.exports = {
    tweet_video : function(status, videoFile){
    return tweet_video(status, videoFile);
  }//,
};

