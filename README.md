Work in progress

# quickQuoteNode
A Node based implementation of quickQuote, exporting to twitter video API. Importing from a video or a live video stream.

[Go here for original ruby on rails implementation that exports html embed code](http://times.github.io/quickQuote/).


## Config file

Config file is in git ignore, but the following code create one for your project. 

```js
var config = {};

config.appdetail 	= 	{appname: 'quickQuote'};
config.appRootPath 	= 	__dirname;

config.twitter = {};
config.spokendata={};

config.spokendata.baseurl 		=	process.env.SPOKENDATA_BASEURL 		|| "";
config.spokendata.userid 		=	process.env.SPOKENDATA_USERID		|| ;
config.spokendata.apitoken 		=	process.env.SPOKENDATA_APITOKEN		|| "";

config.twitter.consumer_key 	=	process.env.TWITTER_CONSUMER_KEY 	|| "";
config.twitter.consumer_secret 	= 	process.env.TWITTER_CONSUMER_SECRET || "";
//config.twitter.token 			=	process.env.TWITTER_TOKEN 			|| "";
//config.twitter.token_secret		= 	process.env.TWITTER_SECRET 			|| "";
config.twitter.callbackURL		=	process.env.TWITTER_CALLBACK		|| 	"";

module.exports = config;
```

## Install dependencies

```bash
npm install
```

## FFMPEG
[ffmpeg](https://github.com/pietrop/InteractiveVideoComponents/wiki/00_components_system_dependencies)

## Mongo db 

### Install  Mongo db 
[Install mongo db](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

```
brew update
```

```
brew install mongodb
```

create default `data` folder 

```
sudo mkdir /data/db
```

### run Mongo db 
to run mongo db from bash
```
sudo mongod
```

to shut down 

`ctrl` + `z`

## Run the app

```bash
npm start
```

## video file

as the video file is 207.5 mb is not included in the git repo, and the `.gitignore` is set to exclude videos from the repo to stop it from upload. So here is a[link to video file](https://dl.dropboxusercontent.com/u/449999/debate_test.mp4). 

[srt file of this video can also be found here](https://dl.dropboxusercontent.com/u/449999/GOP_DEBATE_small.srt)

<!--  -->
The srt is provided temporarily before hooking up the speech to text api, as it would be what the speech to text api. 
also thinking of providing option for user to upload own srt or to generate it with speech to text api...
<!--  -->
