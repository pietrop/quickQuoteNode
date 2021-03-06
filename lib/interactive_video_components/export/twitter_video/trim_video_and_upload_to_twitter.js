/**
* trim and upload to twitter in one operation
* make tweet functions waits for trim function to end.
*/
var video_trimmer = require('./trim_video.js')
var tweet = require('./upload_twitter_video.js')

/**
* Trims the video, then when done, tweets the trimmed video to twitter API.
*/										 
var trim_and_upload_to_twitter = function (c, src, input, duration, outName, status){
	video_trimmer.trim_video(src, input, duration,outName, function(){
	  tweet.tweet_video(c,status, outName);
  });
}


module.exports = {
    trim_and_upload_to_twitter : function(c,src, input, duration, outName, status ){
    return trim_and_upload_to_twitter(c,src, input, duration, outName, status);
  }//,
};


/**
* to test video upload in isolation uncomment following code 
* and make sure you have a file `debate_test_trimmed.mp4` that meets twitter video specs
* in the same folder
*/

//credentials
// var config = require('../../../../config.js');
// console.log(config)
// var credTtest = {
//   consumer_key:     	config.twitter.consumer_key ,
//   consumer_secret:  	config.twitter.consumer_secret,
//   access_token:     	config.twitter.token,//only for testing otherwise provided by user
//   access_token_secret:  config.twitter.token_secret//only for testing otherwise provided by user
// };
//dummy data
// var src		= 	"http://147.229.8.44/glocal/data/70-20151224-040435-424-000794-0d2tLJNsm8/steps/020/out/04_webbrowser/video_HD.mp4"//"debate_test.mp4";
// var videoFileOutput	= 	"debate_test_output2.mp4";//needs to be MP4 for twitter specs
// var status			=   "Testing Twitter Video API 2";
// var inputSeconds	= 1;
// var durationSeconds	=	2;

// //test function
// trim_and_upload_to_twitter(credTtest, src, inputSeconds, durationSeconds,videoFileOutput,status);

