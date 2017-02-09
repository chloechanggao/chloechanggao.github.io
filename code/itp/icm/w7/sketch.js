var textFactory = "Grown-ups love figures... When you tell them you've made "+
  "a new friend they never ask you any questions about essential matters. "+
  "They never say to you \"What does his voice sound like? What games does he love best? "+
  "Does he collect butterflies? \" Instead they demand \"How old is he?"+
  "How much does he weigh? How much money does his father make? \" Only"+
  "from these figures do they think they have learned anything about him.";
var currentP = -1;

// var paragraphs;

var img;
function preload() {
  img = loadImage("pic_2.jpg");
}

var imgP;

function setup(){
  var canvas =  createCanvas(50,50);
  canvas.hide();
  
  image(img, 0,0);
  imgP = get();
  imgP.loadPixels();
  imgP = imgP.pixels;
  //console.log(imgP.pixels[100]);
  //loadimgP();
  //background(0);
  
  // paragraphs = selectAll('p');
  // for (var i = 0; i < paragraphs.length; i++){
  //   paragraphs[i].mouseOver(highlight);
  //   paragraphs[i].mouseOut(unhighlight);
  // }
  createElement("br");
  for (var i =0; i < 2500; i++){
    if (i%50 === 0){
      createElement("br");
    }
    var pixel;
    pixel = nextPixel(i);
    var chara = nextChar();
    
    placeChar(pixel,chara);
    
  
  }
    
}

function nextChar(){
  currentP+= 1;
  if (currentP === textFactory.length){
    currentP = 0;
  }
  return textFactory[currentP]; 
}

function nextPixel(i){
  return [imgP[i*4],imgP[i*4+1],imgP[i*4+2],imgP[i*4+3]];
}

function placeChar(pixel,chara){
  var div = createDiv(chara);
  // console.log(pixel);
  div.style('color', 'rgb('+ pixel[0]+','+pixel[1]+','+pixel[2]+')');
  div.mouseOver(highlight);
  // div.mouseOut(unhighlight);
  //div.addClass('shine');
  
  
}


function highlight() {
  //this.style('padding', '180px');
  this.style('color', '#bec7d6');
  this.mouseOver(unhighlight);
}

function unhighlight() {
  //this.style('padding', '180px');
  this.style('color', '#bec7d6');
}