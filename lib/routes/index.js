
/**
 * Module dependencies
 */

var app = module.exports = require('express').Router();
var controllers = require('./controllers');
var passport = require('passport');

var hpConverter = require('../interactive_video_components/processing/srt_to_hypertranscript.js')

app.get('/', controllers.home);
app.get('/hypertranscripts', isAuth, controllers.hyperTranscripts.list);
app.get('/hypertranscripts/:id/show', isAuth, controllers.hyperTranscripts.show);
app.get('/hypertranscripts/new', isAuth, controllers.hyperTranscripts.new);
app.get('/hypertranscripts/:id/delete', isAuth, controllers.hyperTranscripts.delete);

//////////////////////////////////////////////////////////
///////////////Hypertranscript create/////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//TODO: Needs moving in controller.js
// app.post('/hypertranscripts/create', isAuth, controllers.hyperTranscripts.create);
// using multer to handle multipart form requests https://www.npmjs.com/package/multer
var multer = require('multer')
//fine grain controll on how files are stored
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
var hpModel = require('../models').Hypertranscript;
var User = require('../models').User;

app.post('/hypertranscripts/create', isAuth,cpUpload, function (req, res, next) {
 //creating an hypertranscript object and filling in details.
 //using form fields, and video file details.
 //at this time we are not keeping track of the srt file(althou it had been saved in the uploads folder by default).
  var hp = new hpModel({
        title: req.body.title,
        description: req.body.description,
        video:{
          src: req.files['videofile'][0].path,//'path/video.mov',
          srcHTML5:'path/video.mp4',
          videoFileName: req.files['videofile'][0].originalname,//'video.mov',
        },
        timecodeStart:0, //this needs to be read with ffprobe, but is not relevant for quickQuote. so defaulted to zero
        date: new Date(),
      });

    //parse srt into hypertranscript.
	//parsing srt file, returns array of words objects
	hp.words= hpConverter.convert(req.files['srtfile'][0].path);
	// console.log(hpConverter.convert(req.files['srtfile'][0].path));

	// assigning the hypertranscrip to the current user.
	hp._creator =  req.user;  

	//saving the hypertranscript into db
	hp.save(function(err) {
	    if (err) {
	      return res.send(err);
	    }
	 //returning to show page of the given hypertranscript
	 res.redirect('/hypertranscripts/'+hp._id+'/show');
	});
  
});
//////////////////////////////////////////////////////////
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
