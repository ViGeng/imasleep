// server.js
// where your node app starts
///

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));



var io = require('socket.io')(server);
var server = app.listen(process.env.PORT || 300);
var serverData;



function newConnection(socket){
	console.log('new connection: ' + socket.id);
  socket.on('client-start', onClientStart);
	socket.on('client-update', onClientUpdate);
	socket.on('disconnect', onClientExit);

	function onClientStart(){
		
		setInterval(function(){
			socket.emit('server-update', serverData);
		}, 200);
		
	}
  
	function onClientUpdate(data){
    server[socket.id] = data;
	}
  
	function onClientExit(){
    delete server[socket.id];
    console.log(socket.id+' disconnected');
	}
}	


io.sockets.on('connection', newConnection);

