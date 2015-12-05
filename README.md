Work in progress

# quickQuoteNode
A Node based implementation of quickQuote, exporting to twitter video API. Importing from a video or a live video stream.

[Go here for original ruby on rails implementation that exports html embed code](http://times.github.io/quickQuote/).


## Enviroment Variables

`config.json` is in git ignore, but with the following code you can create one for your project. 

```js
{
	"development":
	{ 
	   	"SPOKENDATA_BASEURL": "https://spokendata.com/api",
	    "SPOKENDATA_USERID": ,
	    "SPOKENDATA_APITOKEN": "",
	    "TWITTER_CONSUMER_KEY": "",
	    "TWITTER_CONSUMER_SECRET": "",
	    "TWITTER_CALLBACK": "http://127.0.0.1:3000/auth/twitter/callback",
	    "NODE_PATH": "."
	},
	"production":
	{ 
	   	"SPOKENDATA_BASEURL": "https://spokendata.com/api",
	    "SPOKENDATA_USERID": ,
	    "SPOKENDATA_APITOKEN": "",
	    "TWITTER_CONSUMER_KEY": "",
	    "TWITTER_CONSUMER_SECRET": "",
	    "TWITTER_CALLBACK": "http://getquickquote.com/auth/twitter/callback",
	    "NODE_PATH": "."
	}
}
```


[ENV variables for deployment on heroku](https://devcenter.heroku.com/articles/app-json-schema#env)


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



## Deployment 

<!-- heroku config:set NODE_PATH=.  -->

`app.json` contains the manifest style.

<!-- 
### Heroku multi buildbapck node/ffmpeg -->