"use strict";

var express = require ("express");
var morgan = require('morgan');

var app = express ();

app.use(morgan('dev'));

app.use(express.static('public'));

app.get("/homeworks.json", function(req, res)
{
	res.send(
	{		
		'homeworks':
		[
			'http://ocw.cs.pub.ro/courses/uso/tema-1',
			'http://ocw.cs.pub.ro/courses/uso/tema-2',
			'http://ocw.cs.pub.ro/courses/uso/tema-3',
			'http://ocw.cs.pub.ro/courses/uso/tema-4'
		]
	});
});

var server = app.listen(3000, function () {
	// optional
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
