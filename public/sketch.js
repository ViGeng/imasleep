// sketch.js
// aka the client side

// First of all, shut glitch up about p5's global namespace pollution using this magic comment:
/* global describe p5 setup draw P2D WEBGL ARROW CROSS HAND MOVE TEXT WAIT HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS DEG_TO_RAD RAD_TO_DEG CORNER CORNERS RADIUS RIGHT LEFT CENTER TOP BOTTOM BASELINE POINTS LINES LINE_STRIP LINE_LOOP TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP QUADS QUAD_STRIP TESS CLOSE OPEN CHORD PIE PROJECT SQUARE ROUND BEVEL MITER RGB HSB HSL AUTO ALT BACKSPACE CONTROL DELETE DOWN_ARROW ENTER ESCAPE LEFT_ARROW OPTION RETURN RIGHT_ARROW SHIFT TAB UP_ARROW BLEND REMOVE ADD DARKEST LIGHTEST DIFFERENCE SUBTRACT EXCLUSION MULTIPLY SCREEN REPLACE OVERLAY HARD_LIGHT SOFT_LIGHT DODGE BURN THRESHOLD GRAY OPAQUE INVERT POSTERIZE DILATE ERODE BLUR NORMAL ITALIC BOLD BOLDITALIC LINEAR QUADRATIC BEZIER CURVE STROKE FILL TEXTURE IMMEDIATE IMAGE NEAREST REPEAT CLAMP MIRROR LANDSCAPE PORTRAIT GRID AXES frameCount deltaTime focused cursor frameRate getFrameRate setFrameRate noCursor displayWidth displayHeight windowWidth windowHeight width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams pushStyle popStyle popMatrix pushMatrix registerPromisePreload camera perspective ortho frustum createCamera setCamera setAttributes createCanvas resizeCanvas noCanvas createGraphics blendMode noLoop loop push pop redraw applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase createStringDict createNumberDict storeItem getItem clearStorage removeItem select selectAll removeElements createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ pRotateDirectionX pRotateDirectionY pRotateDirectionZ turnAxis setMoveThreshold setShakeThreshold isKeyPressed keyIsPressed key keyCode keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveGif saveFrames loadImage image tint noTint imageMode pixels blend copy filter get loadPixels set updatePixels loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo createWriter save saveJSON saveJSONObject saveJSONArray saveStrings saveTable writeFile downloadFile abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont append arrayCopy concat reverse shorten shuffle sort splice subset float int str boolean byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim day hour minute millis month second year plane box sphere cylinder cone ellipsoid torus orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadModel model loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess remove canvas drawingContext*/
// Also socket.io:
/* global describe io*/
// now any other lint errors will be your own problem


// if on mobile Safari, we need to request permission to read sensor data
let hasSensorPermission = !(DeviceOrientationEvent.requestPermission || DeviceMotionEvent.requestPermission);

// 3d transformation helpers
// no need to comprehend if not interested, but these are the math that rotates/translates objects in 3D
// and project them onto 2D planes for display
let ROTX = a=> [1,0,0,0, 0,cos(a),-sin(a),0, 0,sin(a),cos(a),0, 0,0,0,1]
let ROTY = a=> [cos(a),0,sin(a),0, 0,1,0,0, -sin(a),0,cos(a),0, 0,0,0,1]
let ROTZ = a=> [cos(a),-sin(a),0,0, sin(a),cos(a),0,0, 0,0,1,0, 0,0,0,1]
let MULT = (A,B)=> [(A)[0]*(B)[0]+(A)[1]*(B)[4]+(A)[2]*(B)[8]+(A)[3]*(B)[12],(A)[0]*(B)[1]+(A)[1]*(B)[5]+(A)[2]*(B)[9]+(A)[3]*(B)[13],(A)[0]*(B)[2]+(A)[1]*(B)[6]+(A)[2]*(B)[10]+(A)[3]*(B)[14],(A)[0]*(B)[3]+(A)[1]*(B)[7]+(A)[2]*(B)[11]+(A)[3]*(B)[15],(A)[4]*(B)[0]+(A)[5]*(B)[4]+(A)[6]*(B)[8]+(A)[7]*(B)[12],(A)[4]*(B)[1]+(A)[5]*(B)[5]+(A)[6]*(B)[9]+(A)[7]*(B)[13],(A)[4]*(B)[2]+(A)[5]*(B)[6]+(A)[6]*(B)[10]+(A)[7]*(B)[14],(A)[4]*(B)[3]+(A)[5]*(B)[7]+(A)[6]*(B)[11]+(A)[7]*(B)[15],(A)[8]*(B)[0]+(A)[9]*(B)[4]+(A)[10]*(B)[8]+(A)[11]*(B)[12],(A)[8]*(B)[1]+(A)[9]*(B)[5]+(A)[10]*(B)[9]+(A)[11]*(B)[13],(A)[8]*(B)[2]+(A)[9]*(B)[6]+(A)[10]*(B)[10]+(A)[11]*(B)[14],(A)[8]*(B)[3]+(A)[9]*(B)[7]+(A)[10]*(B)[11]+(A)[11]*(B)[15],(A)[12]*(B)[0]+(A)[13]*(B)[4]+(A)[14]*(B)[8]+(A)[15]*(B)[12],(A)[12]*(B)[1]+(A)[13]*(B)[5]+(A)[14]*(B)[9]+(A)[15]*(B)[13],(A)[12]*(B)[2]+(A)[13]*(B)[6]+(A)[14]*(B)[10]+(A)[15]*(B)[14],(A)[12]*(B)[3]+(A)[13]*(B)[7]+(A)[14]*(B)[11]+(A)[15]*(B)[15]]
let TRFM = (A,v)=> [((A)[0]*(v)[0]+(A)[1]*(v)[1]+(A)[2]*(v)[2]+(A)[3])/((A)[12]*(v)[0]+(A)[13]*(v)[1]+(A)[14]*(v)[2]+(A)[15]),((A)[4]*(v)[0]+(A)[5]*(v)[1]+(A)[6]*(v)[2]+(A)[7])/((A)[12]*(v)[0]+(A)[13]*(v)[1]+(A)[14]*(v)[2]+(A)[15]),((A)[8]*(v)[0]+(A)[9]*(v)[1]+(A)[10]*(v)[2]+(A)[11])/((A)[12]*(v)[0]+(A)[13]*(v)[1]+(A)[14]*(v)[2]+(A)[15])]
let PROJ = (f,v)=> [(f)*(v)[0]/(v)[2],(f)*(v)[1]/(v)[2]];


// iOS 13 requires pages to beg for user permission before accessing sensors.
// it must also be triggered by a 'touchend'
function begPermission(){
  if (DeviceOrientationEvent.requestPermission){
    DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response == 'granted') {
        
        if (DeviceMotionEvent.requestPermission){
          DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response == 'granted') {
              hasSensorPermission = true;
              window.ondevicemotion = function(event) {
                
                // devices such as iOS 13 doesn't have accleration,
                // instead they have accelerationIncludingGravity, producing inconsistent behavior.
                // here we patch it by canelling out the gravitational acclerration.
                // alternatively, we add the gravitational acceleration to android phones.
                if (!event.acceleration){
                  
                  // compute gravitational acceleration's component on X Y Z axes based on gyroscope
                  // g = ~ 9.80665
                  let grav = TRFM(MULT(
                    ROTY(radians(rotationY)),
                    ROTX(radians(rotationX))
                  ),[0,0,-9.80665]);
                  
                  clientData.accX =  (event.accelerationIncludingGravity.x+grav[0]);
                  clientData.accY =  (event.accelerationIncludingGravity.y+grav[1]);
                  clientData.accZ =  (event.accelerationIncludingGravity.z-grav[2]);
                  
                  // p5 appears to be doubling the acceleration:
                  // https://github.com/processing/p5.js/blob/main/src/events/acceleration.js#L647
                  clientData.accX *= 2;
                  clientData.accY *= 2;
                  clientData.accZ *= 2;
                }
                
              }
            }
          })
          .catch(alert)
        }
      }
    })
    .catch(alert)
  }
}

var socket = io(); // the networking library

var clientData = {}; // stores this particular client's data
var serverData = {}; // stores other users's data from the server

var status = "unknown"; // or 'approve', or 'reject', depending on whether the server decides to let you in

// RGB color backgrounds for the two players
var colors = [
  [120,200,255],
  [255,120,180],
]


// project a 3d vertex into 2d using simple pinhole camera model
function vertex3d(x,y,z,rx,ry,rz,dx,dy,dz,f){
  let T = MULT([1,0,0,dx, 0,1,0,dy, 0,0,1,dz, 0,0,0,1],MULT(ROTY(ry),MULT(ROTX(rx),ROTZ(rz))));
  return PROJ(f,TRFM(T,[x,y,z]));
}


// update status when server tells us whether they approve or reject our request to join a room
socket.on('connection-approve', function(data){
  status = "approve";
})
socket.on('connection-reject', function(data){
  status = "reject";
})

// update our copy everytime the server sends us an update
socket.on('server-update',function(data){
  serverData = data;
})

// p5.js setup
function setup() {
  createCanvas(window.innerWidth,window.innerHeight);  

}

// visualize sensor data
// you'll probably replace these with your own drawings
function drawSensorsData(color,label,hW,hH,data){
  noStroke();
  fill(...color)
  rect(0,0,hW,hH);
  
  textSize(32);
  fill(255);
  textAlign(LEFT);
  text(label,5,32);
  
  
  if (!data){
    textSize(16);
    text("Nobody there.",8,64);
    return;
  }
  
  
  // draw arrow for acceleration
  
  noFill();
  
  strokeWeight(2);
  
  push();
  stroke(255);
  translate(hW/4,hH/2);
  
  let [ax,ay,az] = [(data.accX),
                   -(data.accY),
                    (data.accZ)];
  let ang = Math.atan2(ay,ax);
  let len = Math.hypot(ax,ay)*10;
  push();
  
  rotate(ang);
  line(0,0,len,0);
  noStroke();
  fill(255);
  if (len>4){
    triangle(len-4,-4,len+4,0,len-4,4);
  }
  pop();
  fill(...color);
  stroke(255);
  circle(0,0,az*2+4);
  fill(255);
  if (az > 0){
    circle(0,0,az/2);
  }else{
    line(-az/2,-az/2,az/2,az/2);
    line(az/2,-az/2,-az/2,az/2);
  }  
  pop();
  
  // draw 3D box for rotation
  
  push();
  translate(hW*3/4,hH/2);
  var cam = [-data.rotX,-data.rotY,-data.rotZ, 0,0,20, 100];
  stroke(255);
  let [va,vb,vc,vd, ve,vf,vg,vh] = [
    vertex3d(-8,-8,-8, ...cam),
    vertex3d( 8,-8,-8, ...cam),
    vertex3d( 8, 8,-8, ...cam),
    vertex3d(-8, 8,-8, ...cam),
    
    vertex3d(-8,-8, 8, ...cam),
    vertex3d( 8,-8, 8, ...cam),
    vertex3d( 8, 8, 8, ...cam),
    vertex3d(-8, 8, 8, ...cam),
  ]
  line(...va,...vb);
  line(...vb,...vc);
  line(...vc,...vd);
  line(...vd,...va);
  
  line(...ve,...vf);
  line(...vf,...vg);
  line(...vg,...vh);
  line(...vh,...ve);
  
  line(...va,...ve);
  line(...vb,...vf);
  line(...vc,...vg);
  line(...vd,...vh);
  pop();
    
}

// visualize touches
function drawTouchesData(color,data){
  if (!data || !data.touches){
    return;
  }
  for (var i = 0; i < data.touches.length; i++){
    fill(...color);
    stroke(255);
    circle(data.touches[i].x,data.touches[i].y,90);
  }
  
}

// show error screen when e.g. server rejects user
function screenOfDeath(msg){
  textSize(18);
  background(0);
  fill(255);
  noStroke();
  textAlign(CENTER);
  text(msg,width/2,height/2);
}

// p5.js draw loop
function draw() {
  
  
  if (!hasSensorPermission){
    screenOfDeath("Tap the screen\nto request sensor permissions...");
    return;
  }
  if (status == "reject"){
    screenOfDeath("Sorry, room is full!\nPlease come back later...");
    return;
  }
  if (status == "unknown"){
    screenOfDeath("Waiting for server to usher you...");
    return;
  }
  
  
  // collect all the info and update this client's data
  
  // make rotationX/Y/Z relative to phone orientation
  clientData.rotX = radians([-rotationY,-rotationX,rotationY][~~(window.orientation/90)+1]);
  clientData.rotY = radians([-rotationX, rotationY,rotationX][~~(window.orientation/90)+1]);
  clientData.rotZ = radians(rotationZ);
  clientData.accX = accelerationX || clientData.accX;
  clientData.accY = accelerationY || clientData.accY;
  clientData.accZ = accelerationZ || clientData.accZ;
  clientData.touches = touches;
  
  // send this client's data the server
  socket.emit('client-update',clientData);

  // the other player's data. Since this demo only allows 2 players, we just grab
  // the first item in the table. Use a loop to iterate serverData if you want more than
  // 2 players (check out sensors-chorus or sensors-rooms)
  let otherData = serverData[Object.keys(serverData)[0]];
  
  // visualize the sensors data
  
  let hW = width;
  let hH = height/2;
  if (width > height){
    hW = width/2;
    hH = height;
  }
  
  drawSensorsData(colors[0],"THEM",hW,hH,otherData);

  if (height>width){
    translate(0,hH);
  }else{
    translate(hW,0);
  }

  drawSensorsData(colors[1],"ME",hW,hH,clientData);

  resetMatrix();
  drawTouchesData(colors[0],otherData);
  drawTouchesData(colors[1],clientData);
  
}

function touchStarted(){
  return false;
}
function touchMoved(){
  return false;
}

function touchEnded() {
  if (!hasSensorPermission){
    begPermission();
  }
  return false;
}


function windowResized() { //this detects when the window is resized, such as entering fullscreen mode, or changing orientation of the device.
  resizeCanvas(windowWidth, windowHeight); //resizes the canvas to the new dimensions 
}