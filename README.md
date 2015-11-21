# quickQuoteNode
A Node based implementation of quickQuote, exporting to twitter video API

[Go here for original ruby on rails implementation that exports html embed code](http://times.github.io/quickQuote/).


## Config file

Config file is in git ignore, but the following code create one for your project. 

```
var config = {};

config.twitter = {};
config.spokendata={};



config.spokendata.baseurl 		=	process.env.SPOKENDATA_BASEURL 		|| "";
config.spokendata.userid 		=	process.env.SPOKENDATA_USERID		|| ;
config.spokendata.apitoken 		=	process.env.SPOKENDATA_APITOKEN		|| "";

config.twitter.consumer_key 	=	process.env.TWITTER_CONSUMER_KEY 	|| "";
config.twitter.consumer_secret 	= 	process.env.TWITTER_CONSUMER_SECRET || "";
config.twitter.token 			=	process.env.TWITTER_TOKEN 			|| "";
config.twitter.token_secret		= 	process.env.TWITTER_SECRET 			|| "";

module.exports = config;
```


## Install dependencies

```bash
npm install
```