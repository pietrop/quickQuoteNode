
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

/////////////////////Handling Multiform request////////////////////
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
////////////////////end Handling Multiform request /////////////

app.post('/hypertranscripts/create', isAuth, cpUpload, controllers.hyperTranscripts.create);
///tweet_quote ajax request
app.post('/tweet_quote', isAuth,cpUpload, controllers.hyperTranscripts.tweet);
///export quote ajax request
app.post('/exporthtml_quote', isAuth,cpUpload, controllers.hyperTranscripts.exportHTML);

//gets SRT and SPOKEN DATA MP4 URL
app.get('/retrieve_from_stt_api/:uid', isAuth, controllers.hyperTranscripts.retrieve_from_stt_api);


//user authentication
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/hypertranscripts',
  failureRedirect: '/failure'
}));
app.get('/logout', controllers.logout);
app.get('/failure', controllers.failure);

// TO allow AJAX requests (?)
app.all('/',isAuth, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

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
