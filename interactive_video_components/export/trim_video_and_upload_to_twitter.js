//trim and upload to twitter in one operation
//TODO: make tweet method wait for trim function to end.
//not sure if this works
var video_trimmer = require('./trim_video.js')
var tweet = require('./upload_twitter_video.js')


var trim_and_upload_to_twitter = function (scr, input, duration, outName, status){
	video_trimmer.trim_video(src, input, duration,outName, function(){
	  tweet.tweet_video(status, outName);
  });
}


// video_trimmer.trim_video(videoFile, 200, 5,videoFileOutput);
//trim_video.js needs to return name of output file.
// var twitter_video_trimmed = videoFile.split(".")[0] + "_twitter"+".mp4";
// console.log(twitter_video_trimmed);

//needs a callback so that this runs only when the video has finished being trimmed

// tweet.tweet_video(status, videoFileOutput);
// tweet.tweet_video(status, videoFileOutput);
var src		= 	"debate_test.mp4";
var videoFileOutput	= 	"debate_test_output2.mp4";//needs to be MP4 for twitter specs
var status			=   "Testing Twitter Video API 2";
var inputSeconds	= 200;
var durationSeconds	=	5;

//test function
trim_and_upload_to_twitter(src, inputSeconds, durationSeconds,videoFileOutput,status);



module.exports = {
    trim_and_upload_to_twitter : function(scr, input, duration, outName, status){
    return trim_and_upload_to_twitter(scr, input, duration, outName, status);
  }//,
};