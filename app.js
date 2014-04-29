'use strict';

// Integrated
var http = require('http'),
    path = require('path');

// Third party
// var connect = require('connect');
var express = require('express'),
    socket = require('socket.io');

// Custom
var logger = require('./logger'),
    mappings = require('./data/mappings');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('redirector'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/:alias', function(req, res) {
	mappings.get(req.params.alias, function(err, mapping) {
		if (err){ return res.send(404); }
		res.redirect(mapping);
	});
});

var server = http.createServer(app);
server.listen(3000);

var io =socket.listen(server);

io.sockets.on('connection', function(socket) {
	mappings.list(function(err, documents) {
		console.log(documents);
		socket.emit('list', documents);
	});

	socket.on('addMapping', function(mapping) {
		mappings.create(mapping.alias, mapping.url, function() {
			console.log('Added mapping ' + mapping);
			io.sockets.emit('newMapping', mapping);
		});
	});
});
