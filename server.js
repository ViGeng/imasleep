const express = require("express");
const app = express();
var server = app.listen(process.env.PORT || 300);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));



var io = require('socket.io')(server);

var serverData = {};



function newConnection(socket){
	console.log('new connection: ' + socket.id);
  socket.on('client-start', onClientStart);
	socket.on('client-update', onClientUpdate);
	socket.on('disconnect', onClientExit);

	function onClientStart(){
		
		setInterval(function(){
			socket.emit('server-update', serverData);
		}, 10);
		
	}
  
	function onClientUpdate(data){
    serverData[socket.id] = data;
	}
  
	function onClientExit(){
    delete serverData[socket.id];
    console.log(socket.id+' disconnected');
	}
}	

console.log("...")
io.sockets.on('connection', newConnection);

