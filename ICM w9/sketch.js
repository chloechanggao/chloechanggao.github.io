var video;

var x = 0;

var artworkPerYr;

function setup() {
  createCanvas(800, 340);
  pixelDensity(1);
  video = createVideo(['artsy_v7.mp4', 'artsy_v7.webm']);
  video.size(320, 340);
  video.hide();
  video.loop();
  background(224, 217, 220);
  // console.log(momadata[10]);
  artworkPerYr = getArtistPerYr();

}

function getArtistPerYr(){
  var result = [0, 0, 0, 0, 0];
  for ( i= 0; i<momadata.length; i++){
    if(momadata[i].Gender[0] === "Female"){
      if (momadata[i].Date>1915 && momadata[i].Date <= 1935){
        result[0]+=1;
      }
      if (momadata[i].Date>1935 && momadata[i].Date <= 1955){
        result[1]+=1;
      }
      if (momadata[i].Date>1955 && momadata[i].Date <= 1975){
        result[2]+=1;
      }
      if (momadata[i].Date>1975 && momadata[i].Date <= 1995){
        result[3]+=1;
      }
      if (momadata[i].Date>1995 && momadata[i].Date <= 2015){
        result[4]+=1;
      }
    }
  }
  return result;
}

function draw() {
  video.loadPixels();

  //image(video, 0, 0);

  var w = video.width;
  var h = video.height;

  copy(video, w / 2, 0, 1, h, x, 0, x + artworkPerYr[int(frameCount/5/30)%5]/100, h);

  x = x + artworkPerYr[int(frameCount/5/30)%5]/100;
  
  if(x>width){
    x = 0;

  }

}
