var capture;
var w = 640;
var h = 490;
// var w = 800;
// var h = 600;
var ctracker;

var video_sq;
var video_f1;
var video_f2;

var currentVideo;


var rx = 0;
var ry = 0;
var lastlastPosition = [];
var lastPosition = [];
var state = "sq";

var enable_serial = false;
var serial;
var portName = '/dev/cu.usbmodemfd121';
var inData;




function setup() {
  //line(30, 20, 85, 75);
  if (enable_serial) {
    serial = new p5.SerialPort();
    inData = '0';
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.open(portName);
  }
  createCanvas(w, h);
  video_f1 = createVideo('Final_V_1.2.mp4');
  video_f2 = createVideo('Fvideo_2.3.mp4');
  video_sq = createVideo('test2.mp4');
  video_f1.hide();
  video_f2.hide();


  currentVideo = video_sq;
  currentVideo.hide();
  currentVideo.loop();

  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();

  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(capture.elt);

}

function serialEvent() {
  inData = serial.readLine();
  if (inData[0] === '1') {
    handleEvent('Y');
  }

  if (inData[0] === '0') {
    handleEvent('E');
  }
  // if (inData == "0") {

  // //capture.elt.start();


  // }
}


function keyPressed() {
  handleEvent(String.fromCharCode(keyCode));
}
//console.log(state);

function handleEvent(event) {
  if (event === 'S') {
    state = 'f1';
    switchVideo('f1');
  } else
  if (event === 'F') {
    state = 'f2';
    switchVideo('f2');
  } else
  if (event === 'E' && state !== 'sq') {
    state = 'sq';
    switchVideo('sq');
  } else
  if (event === 'H') {
    state = 'sqp';
    // switchVideo('sqp');

  } else
  if (event === "Y" && state === 'sq') {
    state = 'sqp';


  }
}



function switchVideo(button) {
  console.log(button);

  currentVideo.pause();
  currentVideo.hide();

  if (button == 'sq') {
    video_sq.loop();
    currentVideo = video_sq;
  } else if (button == 'f1') {
    video_f1.loop();
    currentVideo = video_f1;
  } else if (button == 'f2') {
    video_f2.loop();
    currentVideo = video_f2;
  }
  // else if (button == 'sqp')
  // {
  //   video_sqp.show();
  //   video_sqp.loop();
  //   currentVideo = video_sqp;
  // }
}



function pointMap(xy, ab, m, n) {
  var px = ab[0] - n / m * (xy[0] - ab[0]);
  var py = ab[1] - n / m * (xy[1] - ab[1]);
  return [px, py];
}



function draw() {
  image(currentVideo);
  if (state === "f1" || state === "f2") {
    var position = ctracker.getCurrentPosition();
    //if (position && pDistance(position, lastPosition) <= pDistance(lastPosition, lastlastPosition) * 1.001) {
    if (position) {
      //interpolation
      position[76] = pointMap(position[2], position[0], 2, 2);
      position[75] = pointMap(position[63], position[20], 1, 2);
      position[74] = pointMap(position[34], position[22], 3, 3);
      position[73] = pointMap(position[40], position[18], 3, 3);
      position[72] = pointMap(position[67], position[16], 1, 2);
      position[71] = pointMap(position[12], position[14], 2, 2);


      //Zoom
      var yValue = [];
      for (i = 0; i < position.length; i++) {
        yValue.push(position[i][1]);
      }
      // max(yValue);
      // min(yValue);

      var Z = 1.05 * h / (max(yValue) - min(yValue));

      var newPosition = [];
      for (i = 0; i < position.length; i++) {
        newPosition.push([Z * position[i][0], Z * position[i][1]]);
      }
      position = newPosition;

      //Randomize


      // var ratio = 0.01;
      // for (i=0; i<20; i++){
      //   if(frameCount%20 === 0){
      //     rx = random(-ratio*w, ratio*w);
      //     ry = random(-ratio*w, ratio*w);
      //   }
      //   position[i][0] = position[i][0]+rx;
      //   position[i][1] = position[i][1]+ry;
      // }


      // Translate
      var centerPoint = position[62];
      var x = centerPoint[0];
      var y = centerPoint[1];
      translate(w / 2 - x, h / 2 - y);
      var viewUpperleft = [-(w / 2 - x), -(h / 2 - y)];
      var viewUpperright = [viewUpperleft[0] + w, viewUpperleft[1]];
      var viewLowerright = [viewUpperleft[0] + w, viewUpperleft[1] + h];
      var viewLowerleft = [viewUpperleft[0], viewUpperleft[1] + h];

      //regression
      if (lastPosition.length > 0) {
        for (i = 0; i < position.length; i++) {
          position[i] = pointMap(lastPosition[i], position[i], 4, -3);

        }
      }

      //Draw
      var facePositions = slice(position, 0, 14).concat(slice(position, 71, 76)).concat([position[0], viewUpperleft, viewUpperright, viewLowerright, viewLowerleft, viewUpperleft]);
      drawShape(facePositions, true);
      var lefteyePosition = [position[23], position[66], position[26], position[65], position[25], position[64], position[24], position[63]];
      drawShape(lefteyePosition, true);
      var righteyePosition = [position[30], position[69], position[31], position[70], position[28], position[67], position[29], position[68]];
      drawShape(righteyePosition, true);
      var upperlipPosition = slice(position, 44, 50).concat(slice(position, 59, 61));
      drawShape(upperlipPosition, true);
      var lowerlipPosition = slice(position, 50, 55).concat([position[44]]).concat(slice(position, 56, 58));
      drawShape(lowerlipPosition, true);
      // var masklinePosition = [position[0],[0,0],[w,0],[w,h],[0,h],[0,0]];
      // fill(0);
      // stroke(255);
      // drawShape(masklinePosition);

      lastlastPosition = lastPosition;
      lastPosition = position;
    }
  }

  if (state === "sq") {
    noFill();
    var circlePoints = [
      [0, 0],
      [1 / 4 * w, 1 / 4 * h],
      [1 / 4 * w, 3 / 4 * h],
      [3 / 4 * w, 3 / 4 * h],
      [3 / 4 * w, 1 / 4 * h],
      [1 / 4 * w, 1 / 4 * h],
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
      [0, 0]
    ];
    drawShape(circlePoints, false)

  }

  if (state === "sqp") {
    noFill();
    circlePoints = [
      [0, 0],
      [1 / 4 * w, 1 / 4 * h],
      [1 / 4 * w, 3 / 4 * h],
      [3 / 4 * w, 3 / 4 * h],
      [3 / 4 * w, 1 / 4 * h],
      [1 / 4 * w, 1 / 4 * h],
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
      [0, 0]
    ];
    drawShape(circlePoints, false)
    textSize(25);
    fill('#ced4dd');
    text("What Do You Want Your Instagram Looks like?", 1 / 8 * w, 1 / 6 * h);
    fill('#f4f8ff');
    //stroke(200);

    textSize(10);
    fill('#ced4dd');
    text("POPULAR", 10 / 11 * w, 2 / 7 * h);
    ellipse(7 / 8 * w, 2 / 7 * h, 35, 35);

    textSize(10);
    fill('#ced4dd');
    text("ARTSY", 10 / 11 * w, 3 / 7 * h);
    fill('#ced4dd');
    ellipse(7 / 8 * w, 3 / 7 * h, 35, 35);

    textSize(10);
    fill('#f2f2f2');
    text("FAMOUSE", 10 / 11 * w, 4 / 7 * h);
    fill('#f2f2f2');
    ellipse(7 / 8 * w, 4 / 7 * h, 35, 35);

    textSize(10);
    fill('#cccccc');
    text("COOL", 10 / 11 * w, 5 / 7 * h);
    fill('#cccccc');
    ellipse(7 / 8 * w, 5 / 7 * h, 35, 35);
  }


  // noFill();
  // rect(0,0,w,h);
  //noStroke();




  // image(capture, 0, 0, 640, 480);

}

function pDistance(p1, p2) {
  if (!p1 || !p2 || p1.length == 0 || p1.length != p2.length) {
    return 0;
  }
  var ret = 0;
  for (var i = 0; i < p1.length; i++) {
    ret += dist(p1[i][0], p1[i][1], p2[i][0], p2[i][1]);
  }
  return ret;
}

function slice(nums, start, end) {
  var r = [];
  for (i = start; i < end + 1; i++) {
    r.push(nums[i]);
    //console.log(nums[i]);
  }
  return r;
}

// e1: slice([1,3,4], 0, 2) -> [1,3,4]
// e2: slice([1,2,4,5], 1, 3) -> [2,4,5]


function drawShape(points, curvy) {
  // example1 drawShape([1,1],[1,2],[2,2], [2,1]) -> draw a square
  // example1 drawShape([3,1],[4,4],[1,2],[5,2],[2,4]) -> draw a star
  fill(255);
  beginShape();
  noStroke();
  for (i = 0; i < points.length; i++) {

    var x0 = points[i][0];
    var y0 = points[i][1];
    //if(strokeSkip && i > points.length - strokeSkip) {
    // noStroke();
    //}
    //vertex(x0, y0);
    if (curvy === true) {
      curveVertex(x0, y0);
    } else {
      vertex(x0, y0);
    }
  }

  endShape(CLOSE);

}