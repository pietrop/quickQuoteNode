
/**
 * Module dependencies
 */
var srt2JSON  = require('lib/interactive_video_components/processing/srt_to_hypertranscript');

/**
 * temporary hypertranscript, 
 * TODO: make CRUD for hypertranscript, with mongoose db
 */
var htJSON = srt2JSON.convert('media/test.srt');

/**
 * App data
 * TODO: Move to config file
 */

var appdetail= {appname: 'quickQuote'};

/**
 * Homepage
 */

exports.home = function (req, res) {
  res.render('default',{title:'Welcome',appdetails: appdetail, user: req.user });
};

/**
 * Hypertranscripts
 */

exports.hyperTranscripts = {};

exports.hyperTranscripts.list = function(req, res) {
  // return res.send("You are already authenticated.");
   res.render('hypertranscripts',{title:'Hypertranscripts',appdetails: appdetail, user: req.user});
};

exports.hyperTranscripts.show = function (req, res) {
  var id = req.params.id;
  //TODO Change this to CRUD for hypertranscript
  var hp = (htJSON.id == id)? htJSON : undefined;
  res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hp, user: req.user });
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
