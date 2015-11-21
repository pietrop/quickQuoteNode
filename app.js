var srt_to_json = require('./interactive_video_components/processing/srt_to_hypertranscript.js')
// var hp_utilities=require('./hypertranscript_utilities.js')
var hypertranscript_json = srt_to_json.convert('./media/test.srt');

// var srtFileContent = srt_to_json.returnSrt('test.srt');
// var srtObject = srt_to_json.returnSrtObject('test.srt');
// var srtText = srt_to_json.returnText('test.srt');

//ENVIROMENT Variables
var config = require('./config');
// console.log(config);
console.log(hypertranscript_json);

var appdetail={appname: "quickQuote"}

var express = require('express');
var app = express();
app.set('view engine','ejs');

//to serve static assets line videos
app.use('/videos', express.static(__dirname + '/media'));
app.use('/css', express.static(__dirname + '/views/css'));
app.use('/js', express.static(__dirname + '/views/js'));


app.get('/', function (req, res) {
  res.render('default',{title:'Welcome',appdetails: appdetail});
});


app.get('/hypertranscripts', function (req, res) {
  res.render('default',{title:'Hypertranscripts',appdetails: appdetail});
});

app.get('/hypertranscripts/:id/show', function (req, res) {
  var id = req.params.id;
  hp = (hypertranscript_json.id == id)? hypertranscript_json : undefined;
  res.render('hypertranscript_show',{title:'Hypertranscript',appdetails: appdetail, hypertranscript: hp});
});

//json export
app.get('/hypertranscripts/:id/json', function (req, res) {
  // res.send('Hello World!');
  var id = req.params.id;
   hp = (hypertranscript_json.id == id)? hypertranscript_json : {response: undefined};
  // res.json(200,{title:'Hypertranscript', hypertranscript: hp});
  res.status(200).json(hp);
  // if(hypertranscript_json.id==id){
  //   res.json({ response:hypertranscript_json});  
  // }else{
  //   res.json({ response: "No transcript matching that id"});
  // }
  
});




var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
