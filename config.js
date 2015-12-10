/**
* if development load ENV from config.json
* if production do nothing, as in production these are stored in heroku ENV
*/
var env = process.env.NODE_ENV || 'development';
if (env == "development"){
	console.log("env-");
	console.log(env);	

	/**
	* Load ENV from app.json, dev once into local system
	* production once into heroku
	*/
	var fs = require('fs');
	var enviromentVariables = fs.readFileSync("config.json",'utf8');
	configJson = JSON.parse(enviromentVariables);

	/**
	* assign ENV variables to development system enviroment.
	*/
	var developmentKeys= configJson['development'];
	for (var key in developmentKeys){
		process.env[key]=developmentKeys[key];
	}


	/** 
	* Heroku Set ENV variables
	* Loop through JSON that has ENV keys
	* and uses Library to make system calls from javascript
	*/
	var exec = require('child_process').exec;
	var productionKeys = configJson['production'];
	for (var key in productionKeys){
		var value = productionKeys[key];
		// system call, to heroku to set ENV variables
		exec("heroku config:set "+key+"="+value);
	}

}




/**
* Make config with ENV available to app.
* To make it convinient to work with ENV var in the app.
*/

var config = {};
 
config.spokendata 	=	{};
config.twitter 		= 	{};
config.db 		= 	{};
config.amazonS3 	=	{};

config.appdetail 	= 	{appname: 'quickQuote'};
config.appRootPath 	= 	__dirname;

config.spokendata.baseurl 		=	process.env.SPOKENDATA_BASEURL; 		
config.spokendata.userid 		=	process.env.SPOKENDATA_USERID;
config.spokendata.apitoken 		=	process.env.SPOKENDATA_APITOKEN;

config.twitter.consumer_key 	=	process.env.TWITTER_CONSUMER_KEY;
config.twitter.consumer_secret 	= 	process.env.TWITTER_CONSUMER_SECRET;
config.twitter.callbackURL		=	process.env.TWITTER_CALLBACK;

config.db.path					=	process.env.MONGOLAB_URI;

module.exports = config;

