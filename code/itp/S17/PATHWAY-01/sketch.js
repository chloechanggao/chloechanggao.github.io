// Declare Kinectron
var kinectron = null;

// Create P5 Canvas
var myCanvas = null;

// Create objects to store and access hands
var handColors = {};
var hands = {};

var bodyColors = {};
var bodies = {};

var bodyIds = [];
// bezier
var anchor1X, anchor1Y, control1X, control1Y, control2X, control2Y, anchor2X, anchor2Y;

var Fanchor1X, Fanchor1Y, Fcontrol1X, Fcontrol1Y, Fcontrol2X, Fcontrol2Y, Fanchor2X, Fanchor2Y;

// circle radius
var r = 7;
var handScale = 10;
var footScale = 12;
var handAngle = 0;
var footAngle = 0;

var opac = 200;

function setup() {
  myCanvas = createCanvas(800,600);
  background(0);
  noStroke();

  // Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.228.147"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();

  //

  kinectron.startTrackedBodies(bodyTracked);


  // Request right hand and set callback for received hand
  //kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawHand);
}

function draw() {

}

function bodyTracked(body) {


  // If we already have a color for incoming hand
  if (body.trackingId in bodyColors) {
    // Create color property and give the hand its assigned color
    body.color = bodyColors[body.trackingId];
  } else {
    // If we don't have a color for the hand yet
    // Create a random RGB color
    var randomColor = [random(50,255), random(50,255), random(50,255)];
    // Create color property on the hand and assign it a random color
    body.color = randomColor;
    // Add it to an array for easy look up
    bodyColors[body.trackingId] = body.color;
    append(bodyIds, body.trackingId);
  }

  bodies[body.trackingId] = body;

  // Use hands object to store hands for drawing
  // Update or create the hand in the hands object
  // while (bodyIds.length >= 3) {
  //   var removeFirstBody = bodyIds[0];
  //   delete bodies[removeFirstBody];
  //   delete bodyIds[0];
  // }




  // Clear background
  background(0, 70);





  // Draw an ellipse at each hand's location in its designated color
  for (var key in bodies) {
    console.log("hello");
    var trackedBody = bodies[key];
    noStroke();
    trackedBody.handRight = trackedBody.joints[kinectron.HANDRIGHT];
    trackedBody.handLeft = trackedBody.joints[kinectron.HANDLEFT];
    trackedBody.footRight = trackedBody.joints[kinectron.FOOTRIGHT];
    trackedBody.footLeft = trackedBody.joints[kinectron.FOOTLEFT];
    fill(trackedBody.color[0], trackedBody.color[1], trackedBody.color[2], opac);
    ellipse(trackedBody.handRight.depthX * myCanvas.width, trackedBody.handRight.depthY * myCanvas.height, sin(handAngle)*r+handScale, sin(handAngle)*r+handScale);
    ellipse(trackedBody.handLeft.depthX * myCanvas.width, trackedBody.handLeft.depthY * myCanvas.height, sin(handAngle)*r+handScale, sin(handAngle)*r+handScale);
    ellipse(trackedBody.footRight.depthX * myCanvas.width, trackedBody.footRight.depthY * myCanvas.height, sin(footAngle)*r+footScale, sin(footAngle)*r+footScale);
    ellipse(trackedBody.footLeft.depthX * myCanvas.width, trackedBody.footLeft.depthY * myCanvas.height, sin(footAngle)*r+footScale, sin(footAngle)*r+footScale);

  }




  // draw line between left of body 1 and right of body 2
  var bezier1 = bodies[bodyIds[0]];
  var bezier2 = bodies[bodyIds[1]];

  // detect dist between left and right hands
  var dHands = dist(bezier1.handRight.depthX, bezier1.handRight.depthY, bezier2.handLeft.depthX, bezier2.handLeft.depthY);
  var dFoot = dist(bezier1.footRight.depthX, bezier1.footRight.depthY, bezier2.footLeft.depthX, bezier2.footLeft.depthY);

  dHands = dHands*1000;
  dFoot = dFoot*1000;


  if (dHands < 170) {
    // console.log("close!");
    handAngle=0;

    anchor1X = bezier1.handRight.depthX * myCanvas.width;
    anchor1Y = bezier1.handRight.depthY * myCanvas.height;
    control1X = bezier1.handLeft.depthX * myCanvas.width;
    control1Y = bezier1.handLeft.depthY * myCanvas.height;

    anchor2X = bezier2.handLeft.depthX * myCanvas.width;
    anchor2Y = bezier2.handLeft.depthY * myCanvas.height;
    control2X = bezier2.handRight.depthX * myCanvas.width;
    control2Y = bezier2.handRight.depthY * myCanvas.height;
    // bezier for hand connection
    noFill();
    stroke(255);
    strokeWeight(1);
    bezier(anchor1X, anchor1Y, control1X, control1Y, control2X, control2Y, anchor2X, anchor2Y);
  } else {
    handAngle += 0.08;
  }

  if (dFoot < 280) {
    footAngle=0;

    Fanchor1X = bezier1.footRight.depthX * myCanvas.width;
    Fanchor1Y = bezier1.footRight.depthY * myCanvas.height;
    Fcontrol1X = bezier1.footLeft.depthX * myCanvas.width;
    Fcontrol1Y = bezier1.footLeft.depthY * myCanvas.height;

    Fanchor2X = bezier2.footLeft.depthX * myCanvas.width;
    Fanchor2Y = bezier2.footLeft.depthY * myCanvas.height;
    Fcontrol2X = bezier2.footRight.depthX * myCanvas.width;
    Fcontrol2Y = bezier2.footRight.depthY * myCanvas.height;

    bezier(Fanchor1X, Fanchor1Y, Fcontrol1X, Fcontrol1Y, Fcontrol2X, Fcontrol2Y, Fanchor2X, Fanchor2Y);
  }  else {
    footAngle += 0.08;
  }
}
