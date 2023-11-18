# Sleep Early Together

This is a course assignment from HKUST(GZ) CMA5001.
This mini application is to help people know whether their friends have slept or not.
The motivation of this application is to help people sleep early and have a healthy life.

## Features

🛌 **Show friends sleeping status**

🔔 You can slightly tap your friend to kindly remind him/her to sleep

⏳ Show you are going to sleep

📊 Show your sleeping history which can be seen by your friends

## Road Map

- show sleeping status
  - [x] client-server communication
  - [x] show sleeping status
- [ ] distinguish users: icons and users are corresponding
- [ ] Beautify the user interface
  - [ ] 🏠 house icon on buttons
  - [ ] 💡 bulb icon on buttons

## networked-touches
- Share multitouch data between exactly two players.

### public/sketch.js
This is just like the normal "sketch.js" you usually have in p5.js projects, but it also includes code that talks to the server.

### server.js
This is the server code, which receives each client's data and transmits that to other client(s).


## Technologies
- p5.js
- socket.io
- express

## Glitch Tips
First time using Glitch? Check out these [Glitch tips](https://glitch.com/edit/#!/ld-glitch-tips?path=README.md)