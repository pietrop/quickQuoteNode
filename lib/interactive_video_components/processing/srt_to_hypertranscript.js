/**
* Slighly modified version that given an srt file, retun an array of timecoded words
*/

var parser = require('subtitles-parser')
var fs = require('fs');

var open_srt = function(srt){
  var srt_file = fs.readFileSync(srt,'utf8');
  return srt_file;
}

// var parseSrtToTxt = function(srt){
// 	srt_json = parse_srt_to_json(srt);
// 	collectLines=[]
// 	for(var i =0; i< srt_json.length; i++){
// 		collectLines.push(srt_json[i].text)
// 	}
// 	var result ="";
// 	for(var i =0; i< srt_json.length; i++){
// 		result+=srt_json[i].text;
// 		//if string contains punctuation full stop then add carriage return
// 		if(srt_json[i].text.indexOf(".") >= 0){
// 			result+="\n";
// 		}
// 	}

// 	return result;
// }

var parse_srt_to_json = function(srt){
	//some check to see if It's a valid srt file?
	var srt =open_srt(srt,'utf8');
	//if you will pass true flag to fromSrt function:
	// then it will convert startTime and endTime properties into millisecods:
	var data = parser.fromSrt(srt,true);	
	return data;
};

//initialises an hyper transcript object
//TODO: needs to be refactored to take in optional params
// title, description from user input
//metadata once from ffprobe of video
// and other sistem once, like src of video file on system
// var setup_hypertranscript = function(){
// 	var hypertranscript={};
// 	//auto calculated
// 	hypertranscript.id =1;//temp
// 	//user input || default combination of metadata ie date + file name
// 	hypertranscript.title="interview title"//temp
// 	hypertranscript.description="interview description"//temp
// 	//from metadata of video
// 	hypertranscript.video={}
// 	hypertranscript.video.id = 1;
// 	hypertranscript.video.src ="./video/debate_test.mov";//temp
// 	hypertranscript.video.srcHTML5 ="/videos/debate_test.mp4";//
// 	hypertranscript.video.reel ="reel temp";//temp
// 	hypertranscript.video.videoFileName ="debate_test.mov";//temp
// 	hypertranscript.video.timecodeStart ="timecodeStart/tc_meta temp";//temp
// 	hypertranscript.video.date="date video shoot"//temp ffrpobe	
// 	// contains array of words ojbects
// 	hypertranscript.words =[]

// 	return hypertranscript;
// }

//takes in array of srt lines objects
//tc in milliseconds
var convert_to_hyper_transcript= function(srt_obj_array){
	//defining hypertranscript object and main propretied
	//for description and metadata of corresponding video
	// var hypertranscript = setup_hypertranscript();
	var srt_hash=[];//= hypertranscript.words;

	//Iterate over lines of srt
	var lines = srt_obj_array;
	// console.log(lines);
	var n =0;
	for(var i=0; i<lines.length ;i++){
		var line = lines[i];
		var word_counter =0;
		var words_in_a_line = line.text.split(" ");

		 number_of_words_in_line = words_in_a_line.length;
		 line_duration = line.endTime - line.startTime;
		 average_word_duration  = line_duration / number_of_words_in_line;
		 number_of_letters_in_a_sentence = 0;

		 //we loop through the array of words, and add up the size of each word
		 for(var j=0; j < words_in_a_line.length; j++){
		 	var word = words_in_a_line[j];
		 	number_of_letters_in_a_sentence += word.length;
		 }
	
	     one_line_array_or_words =[];

	     for(var k=0; k < words_in_a_line.length; k++){
		 	var word = words_in_a_line[k];
		 	word_duration = word.length * average_word_duration;
		 	word_start_time = line.startTime + word_counter * average_word_duration;
		 	word_end_time = word_start_time+word_duration;
		 	corresponding_word = line.text.split(" ")[word_counter];//
		 	
		 	var word_hash ={};
	        word_hash.startTime = (word_start_time/1000).toFixed(2);
	        word_hash.endTime = (word_end_time/1000).toFixed(2);
	        word_hash.text = corresponding_word;
	        // hypertranscript.words.push(word_hash);
	        srt_hash.push(word_hash);
	        // console.log(word_hash)
	        // one_line_array_or_words.push(word_hash);
	        // hypertranscript.words.push(word_hash);
	        word_hash.id = n;
	        word_counter +=1;
	        n+=1;
		 }
		 // console.log("one_line_array_or_words");
		 // console.log(one_line_array_or_words);

		  // hypertranscript.words.push(one_line_array_or_words);
		  one_line_array_or_words =[];
      	  // line_number +=1;

	}

	// console.log(hypertranscript);
	// return JSON.stringify(hypertranscript);
	return srt_hash;
}	


var convert_hp= function(srt){
	// var yo =srt_obj_array;
	var srt_obj_array= parse_srt_to_json(srt);
	return convert_to_hyper_transcript(srt_obj_array);
	// return "lo";
};


module.exports = {
		convert : function(srt){
		return convert_hp(srt);
	}//,
	// 	returnSrt: function(srt){
	// 	return	open_srt(srt);
	// },
	// 	returnSrtObject: function(srt){
	// 	return parse_srt_to_json(srt);
	// }//,
	// 	returnText: function(srt){
	// 	return parseSrtToTxt(srt);
	// }

	
};

