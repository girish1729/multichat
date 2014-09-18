var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var path = require('path');
var routes = require('./routes/index.js');

var app = express();
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(routes.index);

var server = http.createServer(app);
var io = socketio.listen(server);
var port3 =  8033;

server.listen(port3, function() {
    console.log(' - listening on ' + port3 + ' ' + __dirname);
});

var ChatServer = require('./chatserver');
new ChatServer({ io: io }).init();
