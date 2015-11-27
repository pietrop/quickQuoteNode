
/**
 * Module dependencies
 */

var mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost/quickQuoteNodedb');

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
  	video : {
  		id : Number,
  		src: String,
  		srcHTML5 : String,
  		videoFileName : String,
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


