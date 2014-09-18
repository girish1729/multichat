var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var morgan = require('morgan');

var app = express();
process.title = "multichat";
app.set('views', path.join(__dirname, '/'));
app.use(express.static(path.join(__dirname, '/')));
app.use(morgan('dev'));
var server = http.createServer(app);
var port1 =  8055;

server.listen(port1, function() {
    console.log('Listening on ' + port1 + ' ' + __dirname);
});

app.get('/', function(req, res) {
    fs.readFile(path.join(__dirname, "/index.html"), 'utf8', function(err, data) {
	if (err) throw err;
	res.writeHead(200);
	res.end(data);
    });
});
