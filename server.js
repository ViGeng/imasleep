// server.js
// this is the "hub" where the players' data gets sent to each other.
// You 'probably' won't need to modify this file.

// Here's a little socket.io "quick start" summary:
// to send a message:               socket.emit(title,data);
// to deal with a received message: socket.on(title,function(data){ frob(data); })

//========================================================================
const MAX_PLAYERS = 2; // maximum number of players, which is 2 by default.
                       // you can freely change it to another number here,
                       // but will need to update the drawing code in public/sketch.js accordingly

// express (https://expressjs.com/) is a simple node.js framework for writing servers
const express = require("express");
const app = express();
let server = app.listen(process.env.PORT || 3000);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// socket.io is a simple library for networking
let io = require('socket.io')(server);

let serverData = {}; // everyone's data
let numPlayers = 0; // current number of players
let updateCounter = 0; 

console.log("listening...")

// What to do when there's a new player connection:
io.sockets.on('connection', newConnection);

function newConnection(socket){
  
  // Note: "socket" now refers to this particular new player's connection
  console.log('new connection: ' + socket.id);
  
  // if there're too many players, reject player's request to join
  if (numPlayers >= MAX_PLAYERS){
    socket.emit("connection-reject");
    return;
  }
  numPlayers++;
  
  // OK you're in!
  socket.emit("connection-approve");  
  
  // What to do when client sends us a message entitled 'client-update'
  socket.on('client-update',function(data){
    // Here the client updates us about itself
    // in this simple example, we just need to dump the client's data
    // into a big table for sending to everyone later!
    serverData[socket.id] = data;
    updateCounter++;
  })

  
  // Every few milliseconds we send, to this client,
  // the data of everybody else's client.
  // Note: setInterval(f,t) = runs function f every t milliseconds
  let timer = setInterval(function(){
    let others = {};
    for (let k in serverData){
      if (k != socket.id){
        others[k] = serverData[k];
      }
    }
		socket.emit('server-update', others);
	}, 10);
  
  
  // What to do if the client disconnected: let's clean up after them.
  socket.on('disconnect', function(){
    clearInterval(timer); // cancel the scheduled updates we set up earlier
    delete serverData[socket.id];
    console.log(socket.id+' disconnected');
    numPlayers--;
  });
  
  // Egads, we received the "crash-the-server" message!
  // Time for us to restart by deliberately causing an error.
  socket.on('crash-the-server', function(){
    console.log("crashing...")
    let notFun = undefined;
    notFun(); // calling the undefined notFun() causes a (desired) crash!
  });
}