// // Load the MediaPipe handpose model assets.
// handpose.load().then(function(model){
 
//   // Pass in a video stream to the model to obtain 
//   // a prediction from the MediaPipe graph.
//   console.log("model initialized.")
//   const video = document.querySelector("video");
//   model.estimateHands(video).then(function(hands){
//     // Each hand object contains a `landmarks` property,
//     // which is an array of 21 3-D landmarks.
//     hands.forEach(hand => console.log(hand.landmarks));
//   })


// })



function setup() {
  createCanvas(480, 480);
  capture = createCapture(VIDEO);
  capture.hide();
}

function draw() {
  image(capture, 0, 0, width, width * capture.height / capture.width);
  filter(INVERT);
}