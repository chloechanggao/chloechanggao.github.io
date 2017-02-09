var w, l;
var rotationAngle;
var extraRotationAngle;
var positionX;
var xSpeed;
circles1 = [];
circles2 = [];
var theta = 10;
var thetaExtra = 90;
var movement = false;
var canvas;
var capture;
var lastImage = ""; //undefined;
var img;
var frameCounter = 0;



function setup() {
    createCanvas(500, 500);
    canvas = createGraphics(200, 200);
    frameRate(30);
    capture = createCapture(VIDEO);
    capture.hide();
    w = width / 2;
    l = height / 2;


}

function draw() {
    background(220);

    rotationAngle = radians(10 * sin(theta));
    rotationAngleExtra = radians(5 * sin(thetaExtra / 2));
    if (movement === true) {
        theta += 0.1;
        thetaExtra += 0.05;
    }




    // if (movement)
    // {
    // theta += 0.01;
    // thetaExtra += 0.005;
    //}
    //println(degrees(rotationAngle));


    //midpoints
    // push();
    // strokeWeight(3);
    // stroke('#ED225D');
    // line(0, l, width, l);
    // line(w, 0, w, height);
    // pop();

    //perspectivelines
    push();
    translate(width / 2, height / 2);

    strokeWeight(1);
    stroke('#FFFFFF');

    for (i = 0; i < 73; i++) {
        rotate(rotationAngle);
        line(0, 0, width, 0);
    }
    pop();

    //Allinone 
    // push();
    // translate(width/2, height / 2);
    // noStroke();
    // //stroke('#ED225D');
    // var col = color(100,10);
    // fill(col);
    // r = rotationAngle;
    // var c = 50;

    // for (i = 0; i < 18; i++) {
    //   for (j = 0;j < 18;j++){
    //     var f = tan(r)*(width/2);
    //     var s = tan(r)*c;
    //     line(-w,f,w,f);
    //     line(-c,s,c,s);
    //     beginShape();
    //     vertex(-w,f);
    //     vertex(w,f);
    //     vertex(c,s);
    //     vertex(-c,s);
    //     endShape(CLOSE);
    //     r = r + radians(10);
    //   }
    // }
    // pop();

    //horizontallines

    push();
    translate(width / 2, height / 2);
    strokeWeight(1);
    stroke('#FFFFFF');
    //fill('#ED225D');

    var r = rotationAngle;
    var r2 = rotationAngleExtra;

    var radiuz = 1;

    var distances = 1.55;

    for (var dis = 30; dis <= 1000; dis = dis * distances) {
        radiuz = radiuz * 1.7;
        for (j = 1; j <= 4; j++) {
            var a = r;
            var y_coordinate = tan(r * j) * dis;
            var y_static = tan(a) * dis;
            var x_coordinate = y_static / tan(r + r);
            //line(-dis,y_coordinate,dis,y_coordinate);
            //line(-dis,-y_coordinate,dis,-y_coordinate);
            pEdge = ellipse(dis, y_coordinate, radiuz, radiuz);
            circles2.push(pEdge);
            pMiddle = ellipse(x_coordinate, y_coordinate, radiuz, radiuz);
            circles1.push(pMiddle);
            nMiddle = ellipse(-x_coordinate, y_coordinate, radiuz, radiuz);
            circles2.push(nMiddle);
            nEdge = ellipse(-dis, y_coordinate, radiuz, radiuz);
            circles1.push(nEdge);

            pEdge_mirror = ellipse(dis, -y_coordinate, radiuz, radiuz);
            circles1.push(pEdge_mirror);
            pMiddle_mirror = ellipse(x_coordinate, -y_coordinate, radiuz, radiuz);
            circles2.push(pMiddle_mirror);
            nMiddle_mirror = ellipse(-x_coordinate, -y_coordinate, radiuz, radiuz);
            circles1.push(nMiddle_mirror);
            nEdge_mirror = ellipse(-dis, -y_coordinate, radiuz, radiuz);
            circles2.push(nEdge_mirror);
        }
    }
    pop();


    //movecircles
    positionX = circles1.x;
    positionY = circles1.y;
    xSpeed = 2;

    if (positionX == w && positionY == l) {
        radiuz = 0;
    } else {
        xSpeed = xSpeed * -1;
        positionX = circles1.x + xSpeed;
        positionY = circles1.y + xSpeed;
    }

    //////////////////////

    if (lastImage !== "") {
        frameCounter = frameCounter + 1;
        if (frameCounter % 6 === 0) {
            img = loadImage(lastImage, done);
        }
    } else {
        canvas.image(capture, 0, 0, width, width * capture.height / capture.width);
        lastImage = canvas.elt.toDataURL("image/jpeg", 1.0)
    }
}

function done() {
    canvas.image(capture, 0, 0, width, width * capture.height / capture.width);
    lastImage = canvas.elt.toDataURL("image/jpeg", 1.0);
    canvas.blend(img, 0, 0, img.height, img.width, 0, 0, 200, 200, DIFFERENCE);
    var imgData = canvas.elt.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    //  console.log(imgData);
    var sum = 0;
    for (i = 0; i < imgData.data.length; i++) {
        if (i % 4 === 3) {
		
        } else {
            sum = sum + imgData.data[i];

        }

    }
    if (sum > 694683) {
        movement = true;
    } else {
        movement = false;
    }
}
