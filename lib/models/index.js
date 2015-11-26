
/**
 * Module dependencies
 */

var mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost/quickQuoteNodeDb');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var UserSchema = new Schema({
  twitter_id: Number,
  name: String,
  screen_name: String,
  description: String,
  url: String
});

var User = exports.User = mongoose.model('User', UserSchema);
