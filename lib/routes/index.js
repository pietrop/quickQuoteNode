
/**
 * Module dependencies
 */

var app = module.exports = require('express').Router();
var controllers = require('./controllers');
var passport = require('passport');

app.get('/', controllers.home);
app.get('/hypertranscripts', isAuth, controllers.hyperTranscripts.list);
app.get('/hypertranscripts/:id/show', isAuth, controllers.hyperTranscripts.show);
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
