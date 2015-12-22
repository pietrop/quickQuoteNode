
/**
 * Module dependencies
 */

var app = module.exports = require('express').Router();
var controllers = require('./controllers');
var passport = require('passport');
var config = require('config');
//TODO: check if hpConverter needs use here or no?
var hpConverter = require('../interactive_video_components/processing/srt_to_hypertranscript.js')

app.get('/', controllers.home);
app.get('/hypertranscripts', isAuth, controllers.hyperTranscripts.list);
app.get('/hypertranscripts/:id/show', isAuth, controllers.hyperTranscripts.show);
app.get('/hypertranscripts/new', isAuth, controllers.hyperTranscripts.new);
app.get('/hypertranscripts/:id/delete', isAuth, controllers.hyperTranscripts.delete);

//////////////////////////////////////////////////////////
var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now())
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
//sets where the files are being saved
var cpUpload = upload.fields([{ name: 'srtfile', maxCount: 1 }, { name: 'videofile', maxCount: 1 }])
app.post('/hypertranscripts/create', isAuth,cpUpload, controllers.hyperTranscripts.create);
/////////////Hypertranscript create/////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// //TODO: Needs moving in controller.js
// // app.post('/hypertranscripts/create', isAuth, controllers.hyperTranscripts.create);
// // using multer to handle multipart form requests https://www.npmjs.com/package/multer
// var multer = require('multer')
// //fine grain controll on how files are stored
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     // cb(null, file.fieldname + '-' + Date.now())
//   	cb(null, file.originalname)
//   }
// })

// var upload = multer({ storage: storage })
// //sets where the files are being saved
// var cpUpload = upload.fields([{ name: 'srtfile', maxCount: 1 }, { name: 'videofile', maxCount: 1 }])
// var hpModel = require('lib/models').Hypertranscript;
// var User = require('lib/models').User;

// app.post('/hypertranscripts/create', isAuth,cpUpload, function (req, res, next) {
//  //creating an hypertranscript object and filling in details.
//  //using form fields, and video file details.
//  //at this time we are not keeping track of the srt file(althou it had been saved in the uploads folder by default).
//  // console.log("req.files['videofile'][0].path");
//  // console.log(req.files['videofile'][0]);
//   var hp = new hpModel({
//         title: req.body.title,
//         description: req.body.description,
//         video:{
//           src: req.files['videofile'][0].path,//'path/video.mov',
//           srcHTML5:'path/video.mp4',
//           videoFileName: req.files['videofile'][0].originalname,//'video.mov',
//         },
//         timecodeStart:0, //this needs to be read with ffprobe, but is not relevant for quickQuote. so defaulted to zero
//         date: new Date(),
//       });

//   //parse srt into hypertranscript.
// 	//parsing srt file, returns array of words objects
// 	hp.words= hpConverter.convert(req.files['srtfile'][0].path);
// 	// console.log(hpConverter.convert(req.files['srtfile'][0].path));

// 	// assigning the hypertranscrip to the current user.
// 	hp._creator =  req.user;  

// 	//saving the hypertranscript into db
// 	hp.save(function(err) {
// 	    if (err) {
// 	      return res.send(err);
// 	    }
// 	 //returning to show page of the given hypertranscript
// 	 res.redirect('/hypertranscripts/'+hp._id+'/show');
// 	});
  
// });
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

///tweet_quote ajax request
app.post('/tweet_quote', isAuth,cpUpload, function (req, res, next) {
  // console.log(req.body.quoteDetails);
  
  var quote = JSON.parse(req.body.quoteDetails);
  // console.log(quote);
  var input = quote.input;
  var dur = quote.dur;
  var text= quote.text;
// console.log("quote.text");
  // console.log(quote.text);
  // console.log(quote.src);
  var src = config.appRootPath+quote.src.split('3000')[1];//"debate_test_trimmed.mp4";
  // console.log(config.appRootPath)
  // console.log(src);
  //get user twitter tokens (to tweet on their behalfs)

  //require trim and uplod module
var twUploader = require('lib/interactive_video_components/export/twitter_video/trim_video_and_upload_to_twitter')
// var tw_test = require('lib/interactive_video_components/export/twitter_video/upload_twitter_video')
var outName= config.appRootPath+"/twit_export.mp4";
// console.log("outName");
// console.log(outName);
// TWEET ON BEHALF OF USER
//by defining user specific credentials.
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

});
///
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/hypertranscripts',
  failureRedirect: '/failure'
}));
app.get('/logout', controllers.logout);
app.get('/failure', controllers.failure);

/**
 * Helpers
 */ 

function isAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/twitter');
  } else {
    next();
  }
}
