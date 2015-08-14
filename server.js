"use strict";

var express = require ("express");
var morgan = require('morgan');

var app = express ();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pty = require('pty.js');

app.use(morgan('dev'));

app.use(express.static('public'));

app.get("/homeworks.json", function(req, res)
{
	res.send(
	{		
		'homeworks':
		[
			'http://www.ee.surrey.ac.uk/Teaching/Unix/unix1.html',
			'http://www.ee.surrey.ac.uk/Teaching/Unix/unix2.html',
			'http://www.ee.surrey.ac.uk/Teaching/Unix/unix3.html',
			'http://www.ee.surrey.ac.uk/Teaching/Unix/unix4.html'
		]
	});
});

io.on('connection', function (socket) 
{
	var col=0;
	var row=0;
	var term = null;
	socket.on('open', function (data)
	{
		col = data.cols;
		row = data.rows;

		term = pty.spawn('docker', ["run", "-t", "-i", "docker-console"], 
				{
	  				name: 'vt100',
  					cols: col,
  					rows: row,
  					cwd: process.env.HOME,
  					env: process.env
				});

		term.on('data', function(data) 
		{
  			socket.emit("output", {keys: data});
		});

	});

	socket.on('input', function (data) 
	{
		term.write(data.keys);
	});

	socket.on('disconnect', function()
	{
		if (term)
		{
			term.kill('SIGKILL');	
		}
    });
});

var server = http.listen(3000, function () 
{
	// optional
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});

