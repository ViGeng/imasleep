# networked-touches

- Share multitouch data between exactly two players. 
- This app has only one "room"; to support more two-person rooms, consider [this app](https://glitch.com/edit/#!/sensors-rooms).
- To support more than two players, consider [this app](https://glitch.com/edit/#!/sensors-chorus).

### public/sketch.js

This is just like the normal "sketch.js" you usually have in p5.js projects, but it also includes code that talks to the server.

### server.js

This is the server code, which receives each client's data and transmits that to other client(s).


## Technologies

- p5.js
- socket.io
- express

## Glitch Tips

First time using Glitch? Check out Lingdong's [Glitch tips](https://glitch.com/edit/#!/ld-glitch-tips?path=README.md)