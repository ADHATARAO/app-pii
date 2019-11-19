// General
const https = require('https');
const http = require('http');
const express = require('express');
//const request = require('request');
const bodyParser = require('body-parser');

// DataBox
const databox = require('node-databox');
const DATABOX_ARBITER_ENDPOINT = process.env.DATABOX_ARBITER_ENDPOINT || 'tcp://127.0.0.1:4444';
const DATABOX_ZMQ_ENDPOINT = process.env.DATABOX_ZMQ_ENDPOINT || 'tcp://127.0.0.1:5555';
const DATABOX_TESTING = !(process.env.DATABOX_VERSION);

const PORT = DATABOX_TESTING ? 8090 : process.env.PORT || '8080';

//this will ref the timeseriesblob client which will observe and write to the databox actuator (created in the driver)
let store;

//if (DATABOX_TESTING) {
//  store = databox.NewStoreClient(DATABOX_ZMQ_ENDPOINT, DATABOX_ARBITER_ENDPOINT, false);
//} else {
//  const redditSimulatorData = databox.HypercatToDataSourceMetadata(process.env['DATASOURCE_redditSimulatorData']);
//  console.log('redditSimulatorData: ', redditSimulatorData);
//  const redditSimulatorDataStore = databox.GetStoreURLFromHypercat(process.env['DATASOURCE_redditSimulatorData']);
//  console.log('redditSimulatorDataStore: ', redditSimulatorDataStore);
//  store = databox.NewStoreClient(redditSimulatorDataStore, DATABOX_ARBITER_ENDPOINT, false);
//}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ui', function (req, res) {
  res.type('html');
  res.send(`
    <h1>MyApp</h1>

    <p>HelloWorld*************!!!!</p>
  `);
});


function startRead()
{
  // obtain input element through DOM 
  
  var file = document.getElementById('file').files[0];
  if(file)
	{
    getAsText(file);
  }
}

function getAsText(readFile)
{
	var reader;
	try
	{
    reader = new FileReader();
	}catch(e)
	{
		document.getElementById('output').innerHTML = 
			"Error: seems File API is not supported on your browser";
	  return;
  }
  
  // Read file into memory as UTF-8      
  reader.readAsText(readFile, "UTF-8");
  
  // Handle progress, success, and errors
  reader.onprogress = updateProgress;
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

function updateProgress(evt)
{
  if (evt.lengthComputable)
	{
    // evt.loaded and evt.total are ProgressEvent properties
    var loaded = (evt.loaded / evt.total);
    if (loaded < 1)
		{
      // Increase the prog bar length
      // style.width = (loaded * 200) + "px";
			document.getElementById("bar").style.width = (loaded*100) + "%";
    }
  }
}

function loaded(evt)
{
  // Obtain the read file data    
  var fileString = evt.target.result;
  document.getElementById('output').innerHTML = fileString;
		document.getElementById("bar").style.width = 100 + "%";
}

function errorHandler(evt)
{
  if(evt.target.error.code == evt.target.error.NOT_READABLE_ERR)
	{
    // The file could not be read
		document.getElementById('output').innerHTML = "Error reading file..."
  }
}

app.post('/ui', function (req, res) {
  res.type('html');
  res.send(`
    <body>
		<input id="file" type="file" multiple onchange="startRead()">
		<h3>Progress:</h3>
		<div style="width:100%;height:20px;border:1px solid black;">
		<div id="bar" style="background-color:#45F;width:0px;height:20px;"></div>
		</div>
		<h3>File contents:</h3>
		<pre>
			<code id="output">
			</code>
		</pre>
	</body>
  `);
});

app.get('/status', function (req, res) {
  res.send('active');
});



//when testing, we run as http, (to prevent the need for self-signed certs etc);
if (DATABOX_TESTING) {
  console.log('[Creating TEST http server]', PORT);
  http.createServer(app).listen(PORT);
} else {
  console.log('[Creating https server]', PORT);
  const credentials = databox.GetHttpsCredentials();
  https.createServer(credentials, app).listen(PORT);
}

