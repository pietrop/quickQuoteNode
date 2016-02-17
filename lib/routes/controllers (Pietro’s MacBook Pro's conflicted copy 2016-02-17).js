/**
* CRUD Model
*/

var UserModel = require('../models').User;

var hpModel = require('../models').Hypertranscript;
var hpConverter = require('../interactive_video_components/processing/srt_to_hypertranscript.js')
var config = require('config');

/**
 * Module dependencies
 */
var srt2JSON  = require('lib/interactive_video_components/processing/srt_to_hypertranscript');
var fs = require('fs');
/**
 * temporary hypertranscript, 
 * TODO: make CRUD for hypertranscript, with mongoose db
 */
// var htJSON = srt2JSON.convert('media/test.srt');

/**
 * App data
 * TODO: Move to config file
 */
config = require('../../config')
var appdetail = config.appdetail;

/**
 * Homepage
 */

exports.home = function (req, res) {
  res.render('home',{title:'Welcome',appdetails: appdetail, user: req.user });
};

/**
 * Hypertranscripts
 */

exports.hyperTranscripts = {};

/**
* List HyperTranscript
*/

exports.hyperTranscripts.list = function(req, res) {
  // return res.send("You are already authenticated.");
  // console.log(req.user)
    hpModel.find({ _creator: req.user},function(err, hypertranscripts) {
   // hpModel.find(function(err, hypertranscripts) {
    if (err) {
      return res.send(err);
    }
    // res.json(hypertranscripts);
    res.render('hypertranscripts',{title:'Hypertranscripts',appdetails: appdetail,hypertranscripts: hypertranscripts ,user: req.user});
  });
};


/**
* New HyperTranscript
*/

exports.hyperTranscripts.new = function (req, res) {
  
  res.render('hypertranscript_new',{title:'Hypertranscript',appdetails: appdetail,  user: req.user });
};

/**
* Show HyperTranscript
*/

exports.hyperTranscripts.show = function (req, res) {
  // var id = req.params.id;
  //TODO Change this to CRUD for hypertranscript
  // var hp = (htJSON.id == id)? htJSON : undefined;
  // res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hp, user: req.user });
   hpModel.findOne({ _id: req.params.id, _creator: req.user}, function(err, hypertranscript) {
      if (err) {
        return res.send(err);
      }
      // res.json(hypertranscript);
      res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hypertranscript, user: req.user });
    });
};


/**
* Delete HyperTranscript
*/

exports.hyperTranscripts.delete = function (req, res) {
  // var id = req.params.id;
  //TODO Change this to CRUD for hypertranscript
  // var hp = (htJSON.id == id)? htJSON : undefined;
  // res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hp, user: req.user });
  
   hpModel.findOne({ _id: req.params.id, _creator: req.user }, function(err, hypertranscript) {
      if (err) {
        return res.send(err);
      }
        fs.unlinkSync(hypertranscript.video.src, function() {
          //    
        });
    });


    hpModel.findByIdAndRemove({ _id: req.params.id, _creator: req.user }, function(err) {
    if (err){
      res.send(err);
    }

    res.redirect('/hypertranscripts')
    // res.json({ message: 'Beer removed from the locker!' });
  });
};



exports.hyperTranscripts.create = function (req, res) {
  //TODO: Refactor
  var hp = new hpModel({
        title: req.body.title,
        description: req.body.description,
        video:{
          src: req.files['videofile'][0].path,//'path/video.mov',
          // srcHTML5:,//initialising later with spoken data transcoded video file
          videoFileName: req.files['videofile'][0].originalname,//'video.mov',
        },
        timecodeStart:0, //this needs to be read with ffprobe, but is not relevant for quickQuote. so defaulted to zero
        date: new Date(),
      });

  // assigning the hypertranscrip to the current user.
  hp._creator =  req.user; 

  

  //parsing srt file, returns array of words objects
  console.log("req.files['srtfile']")
  console.log(req.files['srtfile'])

 if(req.files['srtfile']){ 
  console.log("Srt at upload");
  //parse srt into hypertranscript.
   hp.words= hpConverter.convert(req.files['srtfile'][0].path);
    hp.save(function(err) {
        if (err) {
          return res.send(err);
        }
        hp.video.ready = true; //as provided srt but no srt
        //returning to show page of the given hypertranscript
          res.redirect('/hypertranscripts/'+hp._id+'/show'); 

    });//save 1 end
  }else{ 
    console.log("No Srt");
    // send to speech to text API.
    hp.video.ready = false;
  //saving the hypertranscript into db
    hp.save(function(err) {
        if (err) {
          return res.send(err);
        }
     //returning to show page of the given hypertranscript
      // res.redirect('/hypertranscripts/'+hp._id+'/show'); 
      // res.redirect('/hypertranscripts/'+hp._id+'/send_to_stt'); 
    
  ////////if video does not have srt file then 
  ////////////////////SEND VIDEO TO SPEECH TO TEXT API /////////////////////
    var SpeechToText = require('lib/interactive_video_components/processing/speech_to_text_api')
    // var filePathName=config.appRootPath +'/'+ req.files['videofile'][0].path;
     var filePathName = config.appRootPath +'/uploads/'+ req.files['videofile'][0].originalname;
    // console.log(filePathName);

    SpeechToText.addNewRecording(filePathName, function(data){
       if(data!= false){
           //save uid
           hp.uid = data;
           hp.video.ready = false;
          hp.save(function(err) {
            if (err) {
              return res.send(err);
            }
            //returning to show page of the given hypertranscript
            res.redirect('/hypertranscripts/'+hp._id+'/show'); 
          });

       }else{
           //raise error
           // res.redirect('/hypertranscripts/'+hp._id+'/show'); 
       }
    })
  ////////////////END SEND VIDEO TO SPEECH TO TEXT API /////////////////////////
  });//hp.save 2
 };//req.files['srtfile'] else

};




/**
* retrieve_from_stt_api,  ajax request
*/

exports.hyperTranscripts.retrieve_from_stt_api = function (req, res, next) {
  var uid = req.params.uid;
  ////////////////////GET VIDEO SRT FROM SPEECH TO TEXT API /////////////////////
  console.log('in controller');
  console.log(uid);

  // get hypertranscript where uid == to uid 
  var SpeechToText = require('lib/interactive_video_components/processing/speech_to_text_api')
  //TODO: concat these API Calls as Async. to do res.json({response:"sucess"}); when they are all done
  // TODO: change src of video and use mp4 video url provided by spoken data 
  // TODO: unlik/delete locally stored video in uploads folder.
  SpeechToText.getvideoUrl(uid, function(data){
    console.log("get url not ready");
    console.log(data);
     if(data!= false){
         //save video url in hypertranscript.
         hpModel.findOne({ uid: uid, _creator: req.user},
          function(err, hypertranscript) {
            if (err) {
              return res.send(err);
            }
            // console.log("data");
            hypertranscript.video.srcHTML5 = JSON.parse(data);
            hypertranscript.video.ready = true;
            hypertranscript.save();
            // res.json({response:"sucess", hp: "hypertranscript" });
          });
     }else{
      console.log("RIGHT HERE")
         //Not been processed yet
         // console.log("not been processed yet");
         res.json({response:"not ready"});
     }
  })
  // //get transcritpion srt and parse into hypertranscript
  SpeechToText.getTranscription(uid, function(data){
     if(data!= false){
         //Parse transcription
           hpModel.findOne({ uid: uid, _creator: req.user},
          function(err, hypertranscript) {
            if (err) {
              return res.send(err);
            }
            // console.log("data");
            hypertranscript.words =data;
            console.log(data);
            
            hypertranscript.video.ready = true;
            hypertranscript.save();
            console.log(hypertranscript.words);
            res.json({response:"sucess", hp: "hypertranscript" });
          });
     }else{
         //raise error
     }
  })
  //TODO: parse and add to hypertranscript, see schema notes (?)
  // SpeechToText.getSpeakerDiarization(uid, function(data){
  //    if(data!= false){
  //        //Parse speaker diarization
  //    }else{
  //        //raise error
  //    }
  // })

////////////////GET VIDEO SRT FROM SPEECH TO TEXT API SPEECH TO TEXT API /////////////////////////
}


/**
* Tweet quote,  ajax request
*/
exports.hyperTranscripts.tweet = function (req, res, next) {
  console.log(req.body.quoteDetails);
  //TODO: get video SRC
  var quote = JSON.parse(req.body.quoteDetails);
  console.log(JSON.stringify(quote));
  var input = quote.input;
  var dur = quote.dur;
  var text= quote.text;
  console.log("quote.src");
  console.log(quote.src);
  var src = config.appRootPath+quote.src.split('3000')[1];//"debate_test_trimmed.mp4";
  
  //require trim and uplod module
  var twUploader = require('lib/interactive_video_components/export/twitter_video/trim_video_and_upload_to_twitter')
  var outName= config.appRootPath+"/twit_export.mp4";
  // TWEET ON BEHALF OF USER by defining user specific credentials.
  var credT = {
    consumer_key:     config.twitter.consumer_key,
    consumer_secret:  config.twitter.consumer_secret,
    access_token:            req.user.token,//config.twitter.token,
    access_token_secret:     req.user.tokenSecret//req.user._id.tokenSecret//config.twitter.token_secret
  };

  //need to pass in the user autentication tokens as an object
  twUploader.trim_and_upload_to_twitter(credT,src, input, dur, outName, quote.text);

  //return sucess message
  res.json({response:"sucess"});
};

/**
* Get Interactive code HTML/CSS/JS Code,  ajax request
*/
exports.hyperTranscripts.exportHTML = function(req, res, next) {
  console.log(req.body.quoteDetails);
//can probably use twitter video trimmer module to crop video
//then save in upload folder(, perhaps providing download link?)
var trimmedQuote ={};
  //TODO: get video SRC
  var quote = JSON.parse(req.body.quoteDetails);
  console.log(JSON.stringify(quote));
  var input = quote.input;
  var dur = quote.dur;
  var text= quote.text;
  console.log("quote.src");
  console.log(quote.src);
  var src = config.appRootPath+quote.src.split('3000')[1];//"debate_test_trimmed.mp4";
  
  //require trim and uplod module
  var videoTrimmer = require('lib/interactive_video_components/export/twitter_video/trim_video')
  
  var outName= config.appRootPath+"/HTML_export.mp4";
  // TWEET ON BEHALF OF USER by defining user specific credentials.
  // var credT = {
  //   consumer_key:     config.twitter.consumer_key,
  //   consumer_secret:  config.twitter.consumer_secret,
  //   access_token:            req.user.token,//config.twitter.token,
  //   access_token_secret:     req.user.tokenSecret//req.user._id.tokenSecret//config.twitter.token_secret
  // };

  trimmedQuote.text = quote.text;
  trimmedQuote.src = outName;
  //need to pass in the user autentication tokens as an object
  // videoTrimmer.trim_video(src, input, dur, outName, quote.text);
  videoTrimmer.trim_video(src,input,dur,outName,function(){
    res.json({response:"sucess", result: trimmedQuote});
  });
  //return sucess message
  
};



/**
 * User
 */

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.failure = function(req, res) {
  return res.send('something wrong');
};
