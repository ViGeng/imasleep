//------------------------------------------------
// Demo in which two mobile phones share p5.js "touches" 
// events (multi-touch finger positions).
// See https://p5js.org/reference/#/p5/touches
// This is sketch.js, a.k.a the client side.

var socket = io(); // the networking library
var clientData = {}; // stores this particular client's data
var serverData = {}; // stores other users' data from the server
var status = "unknown"; // or 'approve' or 'reject', depending on whether the server lets you in
var isSlept = false;
var btns = []; // id: btn
var usernameTexts = []; // id: usernameText
var ASLEEP = "🛌💤"
var AWAKE = "💡👩‍💻"
var MAX_CLIENTS = 6;
var UNSER_NAME = "👩"

let bg;

// RGB color backgrounds for the two players
var colors = [[120,200,255],[255,120,180]]

//------------------------------------------------
// The main p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  createBtns(MAX_CLIENTS);
  // ask the user to input their name
  UNSER_NAME = prompt("What's your name?");
  console.log("User name: " + UNSER_NAME);
}

function preload() {
  // bg = loadImage('https://cdn.glitch.global/70a7d352-0fd9-4805-9455-ee7e480ef561/bg.jpg?v=1700297506960');
  bg = loadImage('https://cdn.glitch.global/70a7d352-0fd9-4805-9455-ee7e480ef561/bg1.jpg?v=1700548696377');
  // bg = loadImage('https://cdn.glitch.global/70a7d352-0fd9-4805-9455-ee7e480ef561/bg2.jpg?v=1700548984082');
}

//------------------------------------------------
// The main p5.js draw loop
//
function draw() {
  image(bg, 0, 0, windowWidth, windowHeight);

  // Add title on the background
  fill(255, 255, 255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Who are asleep?", windowWidth/2, windowHeight/10);

  // 1. Handle problematic network statuses. Shouldn't happen often.
  if (status == "reject"){
    showMyErrorScreen("Sorry, room is full!\nPlease come back later...");
    return;
  } else if (status == "unknown"){
    showMyErrorScreen("Waiting for server to usher you...");
    return;
  }
  toggleBtn();
}

//------------------------------------------------
// Visualize "touches" (fingertips)
//
function drawTouchesData(color, data){
  if (!data || !data.touches){
    return;
  }
  
  for (var i = 0; i < data.touches.length; i++){
    // Note: The '...' below is the JavaScript ES6 "spread" syntax.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    // Useful for handling a variable number of arguments.
    fill(...color);
    
    stroke(255);
    circle(data.touches[i].x,data.touches[i].y,90);
  }
}

function onBtnPressed(){
  isSlept = !isSlept;
  // toggleBtn(isSlept)
  clientData.isSlept = isSlept;
  clientData.username = UNSER_NAME;
  socket.emit('client-update', clientData);
}

function createBtns(number){
  for (let i = 0; i < number; i++) {
    console.log("Create Btn: " + i);
    let btn = createButton(AWAKE);
    // Apply CSS styling
    btn.style('background-color', '#0078D7');
    btn.style('color', 'white');
    btn.style('padding', '10px');
    btn.style('font-size', '20px');
    btn.style('border', 'none');
    btn.style('border-radius', '6px');
    btn.style('box-shadow', '0px 4px 8px rgba(0, 0, 0, 0.25)');
    btn.style('cursor', 'pointer');
    btn.position(windowWidth/2, windowHeight/(number+1) * (i + 1));

    // add title for this button
    let usernameText = createP("烂尾楼" + i);
    usernameText.style('color', 'white');
    usernameText.style('font-size', '20px');
    usernameText.position(btn.x, btn.y + btn.height + 8);

    btns.push(btn);
    usernameTexts.push(usernameText);
    btn.mousePressed(onBtnPressed);
    btn.touchStarted(onBtnPressed);
  }
}

function toggleBtn(){
  let idx = 0;
  for (let k in serverData){
    changeBtnStatus(idx, serverData[k], k == socket.id);
    idx++;
  }
}

function changeBtnStatus(idx, clientData, isMe){
  let btn = btns[idx];
  let usernameText = usernameTexts[idx];
  if (isMe) {
    btn.style('border', '3px solid Blue');
  } else {
    // disable the button, the user can not click
    btn.attribute('disabled', true);
  }
  if (clientData['isSlept']) {
    btn.html(ASLEEP);
    btn.style('background-color', 'Black');
    btn.style('color', 'white');
    // Set a text under the button using the username
  } else {
    btn.html(AWAKE);
    btn.style('background-color', 'Yellow');
    btn.style('color', 'black');
  }
  // get the username text
  usernameText.html(clientData['username']);
}

//------------------------------------------------
// Show an error screen if there's a network problem.
function showMyErrorScreen(msg){
  textSize(18);
  background(0);
  fill(255);
  noStroke();
  textAlign(CENTER);
  text(msg,width/2,height/2);
}

//------------------------------------------------
// These event handlers are used by p5.js. See, e.g.
// https://p5js.org/reference/#/p5/touchStarted, etc.
//
function touchStarted(){
  var fs = fullscreen();
  if (!fs) {
    /* 
      Uncomment the line below to put your app in fullscreen.
      Note, on some devices, being in fullscreen can make it 
      awkward to access useful things like the page-refresh button.
      Perhaps just use this for final documentation.
    */
    fullscreen(true); 
  }
  return false;
}
function touchMoved(){
  return false;
}
function touchEnded() {
  return false;
}

// prevents the mobile browser from processing some default
// touch events, like swiping left for "back" or scrolling the page.
document.ontouchmove = function(event) {
    event.preventDefault();
};

function windowResized() { //this detects when the window is resized, such as entering fullscreen mode, or changing orientation of the device.
  resizeCanvas(windowWidth, windowHeight); //resizes the canvas to the new dimensions 
}



//------------------------------------------------
// Event handlers for the Socket library. 
// You probably won't need to change these. 
//
socket.on('connection-approve', function(data){
  // Update status when server tells us when 
  // they approve our request to join a room
  status = "approve";
})
socket.on('connection-reject', function(data){
  // Update status when server tells us when 
  // they reject our request to join a room
  status = "reject";
})
socket.on('server-update',function(data){
  // Update our copy of the other players' data
  // everytime the server sends us an update
  serverData = data;
})

// It could happen that you might need to restart the server. 
// For example, if you encounter the “room is full” message while debugging.
// If you put the magic word “crash” in the url (like: http://myapp.glitch.me/?crash)
// then the client will send a message to server to tell it to crash and restart.
if (window.location.href.includes("crash")){
  alert("crash!")
  socket.emit("crash-the-server");
}


//================================================
// Don't delete these 'comments'; they are necessary to make p5.js work with Glitch.com.
// First of all, shut glitch up about p5's global namespace pollution using this magic comment:
/* global describe p5 setup draw P2D WEBGL ARROW CROSS HAND MOVE TEXT WAIT HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS DEG_TO_RAD RAD_TO_DEG CORNER CORNERS RADIUS RIGHT LEFT CENTER TOP BOTTOM BASELINE POINTS LINES LINE_STRIP LINE_LOOP TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP QUADS QUAD_STRIP TESS CLOSE OPEN CHORD PIE PROJECT SQUARE ROUND BEVEL MITER RGB HSB HSL AUTO ALT BACKSPACE CONTROL DELETE DOWN_ARROW ENTER ESCAPE LEFT_ARROW OPTION RETURN RIGHT_ARROW SHIFT TAB UP_ARROW BLEND REMOVE ADD DARKEST LIGHTEST DIFFERENCE SUBTRACT EXCLUSION MULTIPLY SCREEN REPLACE OVERLAY HARD_LIGHT SOFT_LIGHT DODGE BURN THRESHOLD GRAY OPAQUE INVERT POSTERIZE DILATE ERODE BLUR NORMAL ITALIC BOLD BOLDITALIC LINEAR QUADRATIC BEZIER CURVE STROKE FILL TEXTURE IMMEDIATE IMAGE NEAREST REPEAT CLAMP MIRROR LANDSCAPE PORTRAIT GRID AXES frameCount deltaTime focused cursor frameRate getFrameRate setFrameRate noCursor displayWidth displayHeight windowWidth windowHeight width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams pushStyle popStyle popMatrix pushMatrix registerPromisePreload camera perspective ortho frustum createCamera setCamera setAttributes createCanvas resizeCanvas noCanvas createGraphics blendMode noLoop loop push pop redraw applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase createStringDict createNumberDict storeItem getItem clearStorage removeItem select selectAll removeElements createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ pRotateDirectionX pRotateDirectionY pRotateDirectionZ turnAxis setMoveThreshold setShakeThreshold isKeyPressed keyIsPressed key keyCode keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveGif saveFrames loadImage image tint noTint imageMode pixels blend copy filter get loadPixels set updatePixels loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo createWriter save saveJSON saveJSONObject saveJSONArray saveStrings saveTable writeFile downloadFile abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont append arrayCopy concat reverse shorten shuffle sort splice subset float int str boolean byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim day hour minute millis month second year plane box sphere cylinder cone ellipsoid torus orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadModel model loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess remove canvas drawingContext*/
// Also socket.io:
/* global describe io*/
// Now any other lint errors will be your own problem.