// trim_video.ejs
// takes as argument a video, and time in and duration
//returns trimmed video 
//transcoded for the video for twitter video specs
//twitter video specs https://dev.twitter.com/rest/public/uploading-media
//node-fluent-ffmpeg https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
//TODO: modify to return location and name of trimmed video file.

var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();


var trim_video = function(src,input,duration, outputName, callback){
	var videoSrc= src;
	var input = input;//sec
	var duration = duration; //sec
	// TODO: change so  that if outputName not defined, then does following line. outputName as optional param
	// var output = videoSrc.split(".")[0] + "_twitter"+".mp4";//html5
	var command = ffmpeg(videoSrc).seekInput(input).setDuration(duration).output(outputName).videoCodec('libx264').size('1280x1024').aspect('3:1').on('end', callback || function() {
	    console.log('Finished processing');
	  })
	  .run();
	 // return output;
}
// .audioCodec('libfaac')

//// test cutting video
// trim_video('debate_test.mp4',773,3);

module.exports = {
		trim_video : function(src,input,duration){
		return trim_video(src,input,duration,outputName);
	}//,
};
