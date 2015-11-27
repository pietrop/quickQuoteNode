/**
* CRUD Model
*/

var User = require('../models').User;

var hpModel = require('../models').Hypertranscript;


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

exports.hyperTranscripts.list = function(req, res) {
  // return res.send("You are already authenticated.");
    hpModel.find(function(err, hypertranscripts) {
    if (err) {
      return res.send(err);
    }

    // res.json(hypertranscripts);
    res.render('hypertranscripts',{title:'Hypertranscripts',appdetails: appdetail,hypertranscripts: hypertranscripts ,user: req.user});
  });
};




exports.hyperTranscripts.new = function (req, res) {
  
  res.render('hypertranscript_new',{title:'Hypertranscript',appdetails: appdetail,  user: req.user });
};

exports.hyperTranscripts.show = function (req, res) {
  // var id = req.params.id;
  //TODO Change this to CRUD for hypertranscript
  // var hp = (htJSON.id == id)? htJSON : undefined;
  // res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hp, user: req.user });
   hpModel.findOne({ _id: req.params.id}, function(err, hypertranscript) {
      if (err) {
        return res.send(err);
      }
      // res.json(hypertranscript);
      res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hypertranscript, user: req.user });
    });
};




exports.hyperTranscripts.delete = function (req, res) {
  // var id = req.params.id;
  //TODO Change this to CRUD for hypertranscript
  // var hp = (htJSON.id == id)? htJSON : undefined;
  // res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hp, user: req.user });
  

   hpModel.findOne({ _id: req.params.id}, function(err, hypertranscript) {
      if (err) {
        return res.send(err);
      }
        fs.unlinkSync(hypertranscript.video.src, function() {
        // res.send ({
        //   status: "200",
        //   responseType: "string",
        //   response: "success"
        // });     
        });
    });


    hpModel.findByIdAndRemove({ _id: req.params.id}, function(err) {
    if (err){
      res.send(err);
    }
    //also need to delete associated file.

      //  fs.unlink(hypertranscript.video.src, function() {
      // // res.send ({
      // //   status: "200",
      // //   responseType: "string",
      // //   response: "success"
      // // });     
       
      // });

    res.redirect('/hypertranscripts')
    // res.json({ message: 'Beer removed from the locker!' });
  });


  
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
