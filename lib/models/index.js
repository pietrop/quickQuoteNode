
//to clear db
// var mongoose = require('mongoose');
// /* Connect to the DB */
// mongoose.connect('mongodb://localhost/quickQuoteNodedb',function(){
//     /* Drop the DB */
//     mongoose.connection.db.dropDatabase();
// });


/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var config = require('config');
// Connect to db
console.log(config.db.path);
mongoose.connect(config.db.path);

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  twitter_id: Number,
  name: String,
  screen_name: String,
  description: String,
  url: String,
  token: String,
  tokenSecret: String,
  hypertranscripts:[{ type: Schema.Types.ObjectId, ref: 'Hypertranscript' }]
});


var HypertranscriptSchema = new Schema({
	_creator: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  	id : Number,
  	title: String,
  	description: String,
    //uid == unique identifier to retrieve srt and other info from speech to text api, once video has been processed.
    uid: Number,
  	video : {
  		id : Number,
      // url of original file, in current version of quickQuote, deployed on heroku is temp and == to nul after processing
  		src: String,
  		videoFileName : String,
      //Video file as transcoded and stored on speech to text api, used for preview
      srcHTML5 : String,
      ready: Boolean, //wheather it has been processed by the speech to text api
		  timecodeStart : Number,//seconds
		  date : Date
  	},
  	words :[ 
  		{
	        startTime : Number,//seconds
	        endTime:  Number,//seconds
	        text : String,
	        id : Number
  		}
  	]
});



var User = exports.User = mongoose.model('User', UserSchema);

var Hypertranscript = exports.Hypertranscript = mongoose.model('Hypertranscript', HypertranscriptSchema);


