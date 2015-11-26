// db.js
//crud with mongo?


// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!




});


// http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/#register-oauth
// https://github.com/mjhea0/passport-examples