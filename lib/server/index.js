
/**
 * Module dependencies
 */

var config = require('config');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var models = require('lib/models');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/**
 * Authentication layer
 */

var User = models.User;
passport.use(new TwitterStrategy({
  consumerKey: config.twitter.consumer_key,
  consumerSecret: config.twitter.consumer_secret,
  callbackURL: config.twitter.callbackURL
}, function(token, tokenSecret, profile, done) {
  // USER 
  return User.findOne({
    twitter_id: profile.id
  }, function(err, user) {
    if (user) {
      return done(null, user);
    }
    var user = new User;
    user.twitter_id = profile.id;
    user.name = profile.username;
    user.screen_name = profile.displayName;
    user.description = profile._json.description;
    user.url = profile._json.url;

    return user.save(function(err) {
      return done(err, user);
    });
  });
}));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  return User.findById(id, function(err, user) {
    return done(err, user);
  });
});

//EXPRESS
var app = express();

app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'YOURSESSIONSECRET' }));

app.use(passport.initialize());
app.use(passport.session());

//EXPRESS tempalting views and static content
app.set('view engine','ejs');
//to serve static assets line videos
app.use('/videos', express.static(__dirname + '/../../media'));
app.use('/', express.static(__dirname + '/../../public'));

app.use('/', require('lib/routes'));

app.listen(3000);
