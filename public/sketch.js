//------------------------------------------------
// Don't delete these 'comments'; they are necessary to make p5.js work with Glitch.com.
// First of all, shut glitch up about p5's global namespace pollution using this magic comment:
/* global describe p5 setup draw P2D WEBGL ARROW CROSS HAND MOVE TEXT WAIT HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS DEG_TO_RAD RAD_TO_DEG CORNER CORNERS RADIUS RIGHT LEFT CENTER TOP BOTTOM BASELINE POINTS LINES LINE_STRIP LINE_LOOP TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP QUADS QUAD_STRIP TESS CLOSE OPEN CHORD PIE PROJECT SQUARE ROUND BEVEL MITER RGB HSB HSL AUTO ALT BACKSPACE CONTROL DELETE DOWN_ARROW ENTER ESCAPE LEFT_ARROW OPTION RETURN RIGHT_ARROW SHIFT TAB UP_ARROW BLEND REMOVE ADD DARKEST LIGHTEST DIFFERENCE SUBTRACT EXCLUSION MULTIPLY SCREEN REPLACE OVERLAY HARD_LIGHT SOFT_LIGHT DODGE BURN THRESHOLD GRAY OPAQUE INVERT POSTERIZE DILATE ERODE BLUR NORMAL ITALIC BOLD BOLDITALIC LINEAR QUADRATIC BEZIER CURVE STROKE FILL TEXTURE IMMEDIATE IMAGE NEAREST REPEAT CLAMP MIRROR LANDSCAPE PORTRAIT GRID AXES frameCount deltaTime focused cursor frameRate getFrameRate setFrameRate noCursor displayWidth displayHeight windowWidth windowHeight width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams pushStyle popStyle popMatrix pushMatrix registerPromisePreload camera perspective ortho frustum createCamera setCamera setAttributes createCanvas resizeCanvas noCanvas createGraphics blendMode noLoop loop push pop redraw applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase createStringDict createNumberDict storeItem getItem clearStorage removeItem select selectAll removeElements createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ pRotateDirectionX pRotateDirectionY pRotateDirectionZ turnAxis setMoveThreshold setShakeThreshold isKeyPressed keyIsPressed key keyCode keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveGif saveFrames loadImage image tint noTint imageMode pixels blend copy filter get loadPixels set updatePixels loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo createWriter save saveJSON saveJSONObject saveJSONArray saveStrings saveTable writeFile downloadFile abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont append arrayCopy concat reverse shorten shuffle sort splice subset float int str boolean byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim day hour minute millis month second year plane box sphere cylinder cone ellipsoid torus orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadModel model loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess remove canvas drawingContext*/
// Also socket.io:
/* global describe io*/
// Now any other lint errors will be your own problem.


//------------------------------------------------
// Demo in which two mobile phones share p5.js "touches" 
// events (multi-touch finger positions).
// See https://p5js.org/reference/#/p5/touches

// This is sketch.js
// a.k.a the client side

var socket = io(); // the networking library
var clientData = {}; // stores this particular client's data
var serverData = {}; // stores other users's data from the server
var status = "unknown"; // or 'approve', or 'reject', depending on whether the server decides to let you in
let packetCount = 0; 

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
  // Update our copy eof the other player's data
  // everytime the server sends us an update
  serverData = data;
  packetCount++;
})



// RGB color backgrounds for the two players
var colors = [
  [120,200,255],
  [255,120,180],
]


//------------------------------------------------
// The main p5.js setup
function setup() {
  createCanvas(window.innerWidth,window.innerHeight)
  // createCanvas(windowWidth, windowHeight);
}

//------------------------------------------------
// The main p5.js draw loop
function draw() {
  background (60,40,60);
  
  // 1. Handle problematic network statuses
  if (status == "reject"){
    showMyErrorScreen("Sorry, room is full!\nPlease come back later...");
    return;
  }
  if (status == "unknown"){
    showMyErrorScreen("Waiting for server to usher you...");
    return;
  }
  
  // 2. Update touches data: 
  // Collect all the touches info and update this client's data.
  // Then send this client's data the server
  clientData.touches = touches;
  socket.emit('client-update',clientData);

  // 3. Fetch the other player's data. Since this demo only allows 
  // two players, we just grab the first item in the table. 
  // Use a loop to iterate serverData if you want more than
  // two players (check out sensors-chorus or sensors-rooms)
  let otherData = serverData[Object.keys(serverData)[0]];

  // 4. Draw the fingertips.
  drawTouchesData(colors[0],otherData);
  drawTouchesData(colors[1],clientData);
}

//------------------------------------------------
// visualize touches
function drawTouchesData(color,data){
  if (!data || !data.touches){
    return;
  }
  
  // Draw some diagnostic text
  fill(255);
  noStroke();
  textSize(24);
  textAlign(LEFT);
  text(data.touches.length,20,color[0]);
  text(packetCount,20,60);
  text(serverData[Object.keys(serverData)[0]],20,360);
  
  for (var i = 0; i < data.touches.length; i++){
    // FYI: The '...' is the JavaScript ES6 "spread" syntax.
    fill(...color);
    
    stroke(255);
    circle(data.touches[i].x,data.touches[i].y,90);
  }
}

//------------------------------------------------
// Show error screen if e.g. server rejects user
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
// https://p5js.org/reference/#/p5/touchStarted
//
function touchStarted(){
  var fs = fullscreen();
  if (!fs) {
    // fullscreen(true); // uncomment this for fullscreen
  }
  return false;
}
function touchMoved(){
  return false;
}
function touchEnded() {
  return false;
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
document.ontouchmove = function(event) {
    event.preventDefault();
};
 */

function windowResized() { //this detects when the window is resized, such as entering fullscreen mode, or changing orientation of the device.
  resizeCanvas(windowWidth, windowHeight); //resizes the canvas to the new dimensions 
}
