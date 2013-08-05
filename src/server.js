'use strict';

/**
 * Requirements.
 */
var http = require('http');
var io = require('socket.io');
var util = require('./util/util.js');
var fs = require('fs');
var urlParser = require('url');
var log = require('./util/log.js');
var debug = log.debug;
var info = log.info;
var error = log.error;

/**
 * Constants.
 */
process.title = 'pinger';

/**
 * Globals.
 */
var port = 8080;
var maxClients = 1000;
var connectedClients = {
	clients:[],
	length: function(){
		return Object.keys(this.clients).length;
		}
};
var server = http.createServer(serve).listen(port, function() {
	info('Server running at http://127.0.0.1:' + port + '/');
});
var wsServer = io.listen(server);

//DELETE: read the files in current directory
//info("Contents of current dir: " + fs.readdirSync(".").toString());

/**
 *  This callback function is called every time someone
 *   tries to connect to the WebSocket server
 */
 wsServer.on("connection", function(client){
	//Check if the connection is allowed
	if (connectedClients.length() < maxClients)  //come on in
	{
		connectedClients.clients[client.id] = client;
		info ("New client connected: " + client.id + ". Total clients: " + connectedClients.length() + ". Max clients allowed: " + maxClients);
		client.emit("notification", "Welcome, you are client number " + connectedClients.length());
		client.emit("connected");
	}
	else	//kick him out
	{
		info ("Total clients: " + connectedClients.length() + ". Max clients allowed: " + maxClients + ". Kicking out!!");
		client.emit("notification", "Too many connections, you are being kicked out");
		client.disconnect();
	}
	//disconnection event
	client.on('disconnect', function(){
		delete connectedClients.clients[client.id];
		info ("Client disconnected: " + client.id);
	});
	//ping event
	client.on("ping", function(data){
 	info ("Ping received from: " + client.id);
 	client.emit("pong", {clientId: client.id});
 	info ("Pong emmited for: " + client.id);
 	});
 });

/**
 * HTTP server
 */
function serve (request, response) {
  var url = urlParser.parse(request.url, true);
  info ("url: " + JSON.stringify(url));
  info ("url.pathname: " + url.pathname);
	if (url.pathname == '/')
	{
		serve_home(request, response);
		return;
	}
	// avoid going out of the home dir
	if (url.pathname.contains('..'))
	{
		serve_file(404, 'not_found.html', response);
		return;
	}
	if (url.pathname.startsWith('/src/'))
	{
		serve_file(200, '..' + url.pathname, response);
		return;
	}
	serve_file(200, url.pathname, response);
}

/**
 * Serve the home page.
 */
function serve_home(request, response)
{
	info("serving home");
	serve_file(200, 'index.html', response);
}

/*
 * Serve a file.
 */
function serve_file(status, file, response)
{
	info ("serving file: " + file);
	fs.readFile("html/" + file, function(err, data) {
		if (err)
		{
			info ("error reading file: " + file + " - err: " + err + ". Current dir: " + __dirname);
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			response.end('Page not found');
			return;
		}
		var type = 'text/html';
		if (file.endsWith('.js'))
		{
			type = 'text/javascript';
		}
		if (file.endsWith('.css'))
		{
			type = 'text/css';
		}
		response.writeHead(status, {
			'Content-Length': data.length,
			'Content-Type': type
		});
		response.end(data);
	});
}


	


