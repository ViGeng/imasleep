# sensors-duo

- Share phone sensor data between exactly two players 
- For simlicity, if a thrird (or more) player try to connect, they will basically be shut out (Check sensors-rooms for a more sophisticated solution)

### public/sketch.js

This is just like the normal "sketch.js" you usually have in p5.js projects, but it also includes code that talk to the server.

### server.js

This is the server code, which receives client's data and send them to other clients


## Technologies

- p5.js
- socket.io
- express

## Glitch tips

First time using Glitch? Check out my [Glitch tips](https://glitch.com/edit/#!/ld-glitch-tips?path=README.md)