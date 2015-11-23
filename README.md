Work in progress

# quickQuoteNode
A Node based implementation of quickQuote, exporting to twitter video API. Importing from a video or a live video stream.

[Go here for original ruby on rails implementation that exports html embed code](http://times.github.io/quickQuote/).


## Config file

Config file is in git ignore, but the following code create one for your project. 

```js
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


## video file

as the video file is 207.5 mb is not included in the git repo, and the `.gitignore` is set to exclude it from upload. So here is a[link to video file](https://dl.dropboxusercontent.com/u/449999/debate_test.mp4). downlod it and add it to `media/debate_test.mp4` folder.

