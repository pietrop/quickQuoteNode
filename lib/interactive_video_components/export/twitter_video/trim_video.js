/**
* use `ffmpeg-fluent` and trims video by taking as argument a video, time in, duration, output name, and a callback to execute when done.
* also transcodes the video to meet for the video for twitter video specs
* [for twitter video specs](https://dev.twitter.com/rest/public/uploading-media)
* for [node-fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
*/
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();


var trim_video = function(src,input,duration, outputName, callback){
	//absolute file path relative to computer root
	var videoSrc= src; 
	//seconds or hh:mm:ss.mms
	var input = input;
	//seconds
	var duration = duration; 
	var command = ffmpeg(videoSrc).seekInput(input).setDuration(duration).output(outputName).videoCodec('libx264').size('1280x720').aspect('16:9').on('end', callback || function() {
	    console.log('Finished processing');
	  }).run();
	 // return output;
}

/**
* to test test cutting video in isolation uncomment following code 
* and make sure you have a file `debate_test.mp4` in the same folder
*/

// trim_video("debate_test.mp4",773,3,"debate_test_trimmed2.mp4");

module.exports = {
		trim_video : function(src,input,duration,outputName,callback){
		return trim_video(src,input,duration,outputName,callback);
	}//,
};
