/**
* Module to upload video that meets twitter video specification to twitter video API.
* takes in credentials for `twit` library to post text tweet with media id of video
* takes inc credentials for `twitter-media` to post video to twitter video ap and get media id for subsequent tweet.
* 
* NB `twitter-media` user tokens are token and token_secret
* while in `twit` `access_token` and `access_token_secret`.
**/

var fs = require('fs');
var MediaUpload = require('twitter-media');
var Twit = require('twit');


var tweet_video = function(c,text,videoFile){
  //every tweet redefines the credentials for the two twitter libraries.
  var T = new Twit(c);

  var credentials = {
    consumer_key:     c.consumer_key,
    consumer_secret:  c.consumer_secret,
    token:            c.access_token,
    token_secret:     c.access_token_secret
  };

  var video = fs.readFileSync(videoFile);
  var upload = new MediaUpload(credentials);
  /**
  * uploads media, callback returns media id
  * which is then associated with the text tweet
  */
  upload.uploadMedia('video', video, function(err, id_media, res){
    T.post('statuses/update', {status: text, media_ids: [res.media_id_string]}, function(err, data){
      console.log("tweet posted");
      console.log(err, data);
    });
  });

}

/**
* to test video upload in isolation uncomment following code 
* and make sure you have a file `debate_test_trimmed.mp4` that meets twitter video specs
* in the same folder
*/

// var config = require('../../../../config.js');
// var credTtest = {
//   consumer_key:     config.twitter.consumer_key ,
//   consumer_secret:  config.twitter.consumer_secret,
//   access_token:     config.twitter.token,
//   access_token_secret:  config.twitter.token_secret
// };
//
// var status     =   "Testing Twitter Video API";
// var videoFile  =   "./debate_test_trimmed.mp4";
// tweet_video(credTtest, status, videoFile);

module.exports = {
    tweet_video : function(c,status, videoFile){
    return tweet_video(c,status, videoFile);
  }
};

