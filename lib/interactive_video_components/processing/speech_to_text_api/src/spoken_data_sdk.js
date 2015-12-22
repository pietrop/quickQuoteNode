/**
* spoken_data_sdk.js 16-12-2015
* look at implementation of ruby version
* needs to be initialised with keys
* send video - returns UID
*
* also contains method to retrieve speaker diarizaiton
* this is retrieved as a json that is appended to hypertranscript under hypertranscript.speakerdiarization
*/

//TODO need to add errors if api not responding

var https = require('https');
var fs = require('fs');
var async = require("async")
var parseString = require('xml2js').parseString;
var request = require('request');
// var srt_to_hypertranscript = require('../../srt_to_hypertranscript')
var srt_to_hypertranscript = require('lib/interactive_video_components/processing/srt_to_hypertranscript')

//config contains API keys
// var config = require('../../../../config');
var config = require('config');

var locationWhereToSaveSrtFiles="./"

function SpokenDataAPI() {
	//keys
	this.key 		= config.spokendata.apitoken;
	this.baseurl 	= config.spokendata.baseurl;
	this.userid 	= config.spokendata.userid;
	//end points
	this.ENDPOINTS 	= {};
	this.ENDPOINTS['recordingList']	=	"/recordingList";
	this.ENDPOINTS['recording']		=	"/recording";
	/**
	* Base url for api request.
	*/
	this.baseApiRequest= this.baseurl +"/"+ this.userid +"/" +this.key;	

	/**
	* returns a list of all recorings - not actually used
	*/
	this.getRecordingsListURL = function (){
		var url = this.baseApiRequest + this.ENDPOINTS['recordingList']
		return url;
	}

	/**
	* takes in uid of recording
	* returns url to retrieve status of recording. 
	* (and xml with all info associated to recording)
	*/
	this.getRecordingURL = function(uid){
		var url = this.baseApiRequest + this.ENDPOINTS['recording'] +"/"+uid
		return url;
	}


	/** 
	* Builds the URL To send a new recording to spoken data speech to text api, 
	* Helper method
	*/
	this.addNewRecordingURL = function(recordingURL){
		var url = this.baseApiRequest + this.ENDPOINTS['recording'] +"/"+"add?url="+recordingURL+"&language=english"	
		return url;
	}//addNewRecordingURL

	/** 
	* To send a new recording to spoken data speech to text api, 
	* by passing the url of the video file
	* returns recording uid, which needs to be stored to be able to retrieve the srt of the recording once it has been processed.
	*/
	this.addNewRecordingByURL = function(recordingURL, cb){
		if(arguments.length > 1){
			// console.log("true");
			// console.log(arguments[0]);
			cbisPresent = true;
		}else{
			// console.log("false");
			// console.log(arguments[0]);
			cbisPresent = false;
		}
		
		var url = this.addNewRecordingURL(recordingURL);
		// postRequest(postUrlString,fileNameTest);
		// request.post(url);
		request.post({url: url}, function(err,httpResponse,body){
			//TODO: parse XML response return uid of file
			// console.log(body);
			 if (cbisPresent){

				  	
				  	parseString(body, function (err, result) {
						//speaker diarization in json object array of segments
				    	// callback(null, result);
				    	var uid = result['data']['recording'][0]['$']['id'];
				    	cb(uid);
					});   


				 	// return body;
				 }else{
				  	return body;
				 }	  
		})
	}


	/** 
	* To send a new recording to spoken data speech to text api, 
	* by passing the the video file with multiform put request
	* returns recording uid, which needs to be stored to be able to retrieve the srt of the recording once it has been processed.
	*/
	this.addNewRecording = function(fileName, cb){
		var url= this.baseApiRequest+"/recording/put?filename="+fileName+"&language=english";
		// postRequest(url,fileNameTest);
		//TODO: parse XML response return uid of file
		////////////////////////
		async.waterfall([
		    function(callback) {
		        callback(null, url,fileName);
		    },
		    function( url,fileName, callback) {
		       // arg1 now equals 'one' and arg2 now equals 'two'
		       // postRequest(url,fileNameTest);
		       postRequest(url,fileName, function (result){
					// console.log("result");
		       		// console.log(result);
		       		callback(null,result);
		       });
		    },
		    function(xml, callback) {
		        // arg1 now equals 'three'
		        parseString(xml, function (err, result) {
					//gets the UID of the recording  
					var uid = result['data']['recording'][0]['$']['id'];
				    callback(null, uid);
				});   
		    },
		    function(response, callback) {
		        // console.log("resp");		       
		        // console.log(response);
		 		callback(null, response);
		    }
			], function (err, result) {
				// console.log("we are here!");
		  		// console.log(result);
		  		//if there is a callback to save UID
		  		 if (arguments.length > 1){
				  	cb(result);
				 	// return body;
				 }else{
				  	return result;
				 }	  
		});
		////////////////////////
	}//


	/**
	* Checks if recording has been processed. 
	* takes in uid as param
	* this method is used before retrieving srt(transcription) or xml(speaker diarization) of recording to check that those are available
	*/
	this.checkRecordingStatus = function(uid, cb){
		// if(arguments.length > 1){
		// 	// console.log("true");
		// 	// console.log(arguments[0]);
		// 	cbisPresent = true;
		// }else{
		// 	// console.log("false");
		// 	// console.log(arguments[0]);
		// 	cbisPresent = false;
		// }

		var url = this.getRecordingURL(uid);
		//TODO: req to check if rec as been processed
		request(url, function (error, response, body) {
					  if (!error && response.statusCode == 200) {
					 	// callback(null, body);
					 	// console.log("body");	
					 	parseString(body, function (err, result) {
							//speaker diarization in json object array of segments
					    	// callback(null, result);
					    	// console.log(JSON.stringify(result));
                // TODO: I commented out this but no idea why you were using it
					    	//var status =  result['data']['recording'][0]['status'][0];
                var status = 'done';
					    	if(status == "failed"){
					    		// console.log("status "+status);
					    		// if(cbisPresent){
					    			return cb(status);
					    			// return cb(false);
					    		// }else{
					    		// 	return status;
					    		// }
					    			
					    	}else if(status == "done"){
					    		// console.log("status "+status);
					    		// if(cbisPresent){
					    			return cb(status);
					    			// return cb(true);
					    		// }else{
					    		// 	return status;
					    		// }
					    	}else if (status =="processing"){
					    		// console.log("status "+status);
					    		// if(cbisPresent){
					    			return cb(status);
					    			// return cb(false);
					    		// }else{
					    			// return status;
					    		// }
					    	}else{
					    		// console.log("status "+status);
					    		return status;
					   			//ERROR?!
					    	}
					    	
						});   
					 	// console.log(body);		   
					  }//if
					}//anonimous function handling response
				);
	}

	/**
	* srt returned as a string
	*/
	this.getRecordingSRTURL = function(uid){
		var url = this.baseApiRequest + this.ENDPOINTS['recording'] +"/"+uid+"/subtitles.srt"
		return url;
	}

	/**
	* from uid srt fetched, parsed and returned as a json hypertranscript 
	*/
	this.getRecordingSRT = function(uid, c){
		var uid = uid;
		var url = this.getRecordingSRTURL(uid);
		async.waterfall([
		    function(callback) {
		    	//get/compose url of destination to open
				// console.log(url);
		        callback(null, url);
		    },
		    function(url,  callback) {
		    	//open url
				request(url, function (error, response, body) {
					  if (!error && response.statusCode == 200) {
					 	callback(null, body);		   
					  }//if
					}//anonimous function handling response
				);	      
		    },
		    function(body, callback) {
		        //write response to file. srt string -> to str file
				var srtFileName =locationWhereToSaveSrtFiles+"file"+uid+".srt";
				fs.writeFileSync(srtFileName, body, 'utf8');
				// console.log(srtFileName);
				// console.log(body);
		        callback(null, srtFileName);
		    },
		    function(srtFileName, callback) {
			//open file	srt file / parse into hypertranscript json
				//TODO srt_to_hypertranscript.convert needs to take in object with video info
				// and needs to take in object with basic transcript info.
		        var hpypertranscript_json= srt_to_hypertranscript.convert(srtFileName)
		        // console.log(hpypertranscript_json);
		        //TODO: delete srtFileName?
		        callback(null, hpypertranscript_json);
		    }
		], function (err, result) {
			// console.log(result);
			//TODO: save to db here
			// console.log(result);
			c(result);
		    return result;
		});			
	}

		

	/**
	* builds the url to retrieve the recording info as xml, which containes speaker diarization info.
	*/
	this.getRecordingXMLURL = function(uid){
		var url = this.baseApiRequest + this.ENDPOINTS['recording'] +"/"+uid+"/subtitles.xml"
		return url;
	}

	/**
	* srt returned as a xml, with speaker diarization
	* TODO: should probably parse xml and returns it as a json for consistency
	*/
	this.getRecordingXML = function(uid){
		var uid = uid;
		var url = this.getRecordingXMLURL(uid);
		async.waterfall([
		    function(callback) {
		    	//get/compose url of destination to open
				// console.log(url);
		        callback(null, url);
		    },
		    function(url,  callback) {
		    	//open url
				request(url, function (error, response, body) {
					  if (!error && response.statusCode == 200) {
					 	
					 	callback(null, body);		   
					  }//if
					}//anonimous function handling response
				);	      
		    },
		    function(xml, callback) {
		        //open xml of body and parse into json
					parseString(xml, function (err, result) {
						//speaker diarization in json object array of segments
				    	callback(null, result);
					});   
		    },
		    function(xml, callback) {
		    	//make into json string to be able to pass it a round
				var speakerdiarization = JSON.stringify(xml);
		        // console.log(hpypertranscript_json);
		        callback(null, speakerdiarization);
		    }
		], function (err, result) {
			// console.log(result);
			//TODO: save speaker diarization to db here
			//or append to hypertranscript?
			//TODO: combine: get recording srt, make hypertranscript.
			//then get speaker diarization and add to hypertranscript
			// console.log(result);
		    return result;
		});			
	}

	/**
	* Retrieves hypertranscript(json) of srt transcription
	* uses uid param to retrieve it.
	* first checks if the recording has been processed.
	* if status is not 'done' then function returns false.
	* if it is 'done' then it retrieves the srt
	* this is returned as json by `getRecordingSRT` function
	*/
	this.getTranscription = function(uid, cb){
		this.checkRecordingStatus(uid, function (resp){
			// console.log(resp);
			if(resp=="done"){
				SpokenData.getRecordingSRT(uid,function (r){
					cb(r);
				});
			}else{
				// console.log(false);
				return false;
			}
		});
	}

	/**
	* Retrieves hash of speaker diarization
	* uses uid param to retrieve it.
	* first checks if the recording has been processed.
	* if status is not 'done' then function returns false.
	* if it is 'done' then it retrieves the speaker diarization xml
	* this is returned as json by `getRecordingXML` function
	*/
	this.getSpeakerDiarization = function(uid, cb){
		this.checkRecordingStatus(uid, function (resp){
			// console.log(resp);
			if(resp=="done"){
				SpokenData.getRecordingXML(uid, function(r){
					cb(r);
				});
			}else{
				// console.log(false);
				return false;
			}
		});
	}

	/**
	* provided uid, returns url of spoken data store video file
	* helper method for getvideoUrl
	*/
	this.getVideoUrlSpkFile = function(uid, cb){

		var url = this.getRecordingURL(uid);
		//TODO: req to check if rec as been processed
		request(url, function (error, response, body) {
					  if (!error && response.statusCode == 200) {
					 	// callback(null, body);
					 	// console.log("body");	
					 	parseString(body, function (err, result) {
							//speaker diarization in json object array of segments
					    	// callback(null, result);
                // TODO: I commented out this but no idea why you were using it
					    	//var status =  result['data']['recording'][0]['video_url'][0];				   	
               				 // var status = 'done';
							cb(JSON.stringify(result['data']['recording'][0]['video_url'][0]));
					});   
					 	// console.log(body);		   
					  }//if
					}//anonimous function handling response
				);
	}

	/**
	* get video_url
	* first checks video status
	* if it's not been processed return false
	*/
	this.getvideoUrl = function(uid, cb){
		if(arguments.length >=1){
			hasCallback =true;
		}else{
			hasCallback = false;
		}

		this.checkRecordingStatus(uid, function (resp){
			// console.log(resp);
			if(resp=="done"){
				SpokenData.getVideoUrlSpkFile(uid, function (r){
					// console.log(r);
					// console.log(arguments.length);
					if(hasCallback){
						cb(r);
					}else{
						return r;
					}
				});
			}else{
				// console.log(false);
				return false;
			}
		});
	}
	


}//end of spoken data object


/**
* Helper method converts, `processing, done, failed`
* to true or false.
*/
function interpretStatus (status){
	if(status == "processing"){
		return true;
	}else if(status =="failed"){
		return false;
	}else if(status == "done"){
		return false;
	}
}

/** 
* Put request to send a file 
* helper method for addNewRecording
*/
//TODO: fileName and `__dirname` need to be changed to filePath.
function postRequest(postUrl, fileName, callback){
  var fpath = __dirname + '/' + fileName;
  var fstat = fs.statSync(fpath);
  var fsize = fstat['size'];
	
	//request.put
	var req = request.put(postUrl, {headers: { 'content-length': fsize }}, function optionalCallback(err, httpResponse, body) {
	  // console.log(httpResponse.statusCode);
	  // console.log(body);
	  if (err) {
	    return console.error('upload failed:', err);
	  }
	  // console.log('Server responded with:', body);
	  // checks if callback has been passed to the function
	  //if it has been passed then pass body as argument to callback.
	  if (arguments.length >= 2){
	  	// console.log("body");
	  	callback(body);
	 	// return body;
	  }else{
	  	// console.log("else");
	  	return body;
	  }	  
	});
  fs.createReadStream(fpath).pipe(req);
}//postRequest


/////////////////////////////// TESTS ///////////////////////////////


SpokenData = new SpokenDataAPI(); 	

var UID = 6160
//GET VIDEO URL MP4 TRANSCODED AND STORED ON SPOKEN DATA
// SpokenData.getvideoUrl(UID, function (resp){
// 	console.log("Video URL ");
// 	console.log(resp);
// });

// console.log("http://147.229.8.44/glocal/data/70-20150902-004052-977-000794-CyOvRHJWYa/steps/020/out/04_webbrowser/video_HD.mp4")


////GET SRT String FILE FROM UID w-t callback to shtat can save - RETURNS AS JSON Hypertranscript
// SpokenData.getTranscription(UID, function (d){
	// console.log("HyperTranscript");
	// fs.writeFileSync("test.json", JSON.stringify(d), 'utf8');
	// console.log(d);
// });


//GET XML of Speaker diarization - Returned as JSON.
// SpokenData.getSpeakerDiarization(UID, function (d){
// 	console.log("Speaker Diarization");
// fs.writeFileSync("test.json", JSON.stringify(d), 'utf8');
// 	console.log(d);
// });

//UPLOAD VIDEO - POST REQUEST video file
// var fileNameTest='../twit_export.mp4';
// SpokenData.addNewRecording(fileNameTest, function (resp){
//   console.log(resp);
// });


//UPLOAD VIDEO - Through URL - Returns UID so that it can be saved in db to check and retrieve when it has been processed.
// var url = "https://youtu.be/iG9CE55wbtY";
// SpokenData.addNewRecordingByURL(url, function (resp){
// 	console.log(resp);
// });

/////////////////////////////// END TEST ///////////////////////////////

/////////////////////////////// INTERFACE //////////////////////////////

module.exports = {
   getvideoUrl : function(uid,cb){
  	//returns json of speaker diarization
    return SpokenData.getvideoUrl(uid,cb);
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







