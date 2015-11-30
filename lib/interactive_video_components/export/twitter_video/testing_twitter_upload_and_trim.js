/**
* to test trim and upload of video and tweet of status with video  in isolation run the following file 
* and make sure you have a file `debate_test.mp4` in the same folder
*/

var video_trimmer_uploader = require('./trim_video_and_upload_to_twitter.js')
//test data
var videoFile		= 	"./debate_test.mp4";
var videoFileOutput	= 	"debate_test_output.mp4";//needs to be MP4 for twitter specs
var status			=   "Testing Twitter Video API 2";
var inputSeconds	= 200;
var durationSeconds	=	5;

//test function

var config = require('../../../../config.js');
var credTtest = {
  consumer_key:     config.twitter.consumer_key ,
  consumer_secret:  config.twitter.consumer_secret,
  access_token:     config.twitter.token,
  access_token_secret:  config.twitter.token_secret
};

video_trimmer_uploader.trim_and_upload_to_twitter(credTtest,videoFile, inputSeconds, durationSeconds,videoFileOutput,status);
