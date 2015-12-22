/**
* CRUD Model
*/

var UserModel = require('../models').User;

var hpModel = require('../models').Hypertranscript;
var hpConverter = require('../interactive_video_components/processing/srt_to_hypertranscript.js')


/**
 * Module dependencies
 */
var srt2JSON  = require('lib/interactive_video_components/processing/srt_to_hypertranscript');
var fs = require('fs');
/**
 * temporary hypertranscript, 
 * TODO: make CRUD for hypertranscript, with mongoose db
 */
var htJSON = srt2JSON.convert('media/test.srt');

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

/////////////////////

var hpModel = require('../models').Hypertranscript;
//var User = require('../models').User;


exports.hyperTranscripts.create = function (req, res) {
  
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
};
/////////////////////





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
