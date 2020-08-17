// server.js
const MAX_PLAYERS = 2;

const express = require("express");
const app = express();
var server = app.listen(process.env.PORT || 300);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

var io = require('socket.io')(server);

var serverData = {}; // everyone's data

var numPlayers = 0;

function newConnection(socket){
  console.log('new connection: ' + socket.id);
  
  if (numPlayers >= MAX_PLAYERS){
    socket.emit("connection-reject");
    return;
  }
  numPlayers++;
  
  socket.emit("connection-approve");
  
  socket.on('client-update',function(data){
    serverData[socket.id] = data;
  })

  let timer = setInterval(function(){
    var others = {};
    for (var k in serverData){
      if (k != socket.id){
        others[k] = serverData[k];
      }
    }
		socket.emit('server-update', others);
	}, 10);
  
  socket.on('disconnect', function(){
    clearInterval(timer);
    delete serverData[socket.id];
    console.log(socket.id+' disconnected');
    numPlayers--;
  });
}

console.log("listening...")
io.sockets.on('connection', newConnection);

