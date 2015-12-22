// you initialise it, pass the sdk object, CMU sphinx or Spoken data, 
// and it returns common methods interface
// speech_to_text_interface.js

var SpeechToText = require('lib/interactive_video_components/processing/speech_to_text_api/src/spoken_data_sdk.js');


module.exports = {
   getvideoUrl : function(uid,cb){
  	//returns json of speaker diarization
    return SpeechToText.getvideoUrl(uid,cb);
  },
   getTranscription : function(uid,cb){
    	//returns json of hypertranscript
    return SpokenData.getTranscription(uid,cb);
  },
  getSpeakerDiarization : function(uid,cb){
  	//returns json of speaker diarization
    return SpokenData.getSpeakerDiarization(uid,cb);
  },
   addNewRecording : function(fileName,cb){
  	//returns json of speaker diarization
    return SpokenData.addNewRecording(fileName,cb);
  },
   addNewRecordingByURL : function(fileURL,cb){
  	//returns json of speaker diarization
    return SpokenData.addNewRecordingByURL(fileURL,cb);
  },
  version: function(){
  	return "1.0.0";
  }
};