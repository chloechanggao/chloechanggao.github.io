// var era;

var api = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=China';
var apikey = '&api-key=a712fb79985041ed87e9570a76b16a71&begin_date=';
// var yr ='1987';
// var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=parade&api-key=a712fb79985041ed87e9570a76b16a71&fq=1987";
var input;
var beginDate = '0101&end_date=';
var endDate = '1231';


  

function setup() {
  noCanvas();
  // createCanvas(400,200);
   
  input = select('#yr');
  
}

function mousePressed(){
  var url = api + apikey + input.html() + beginDate + input.html() + endDate;
  // url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=parade&api-key=a712fb79985041ed87e9570a76b16a71&fq=1987";
  //url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=parade&api-key=a712fb79985041ed87e9570a76b16a71&begin_date=19870101&end_date=19871231"
  
  loadJSON(url,gotData);
  
}


function gotData(data){
  // era = data;
  var articles = data.response.docs;
  var div = select('#content');
  div.html('');
  div.style('color: #302a2a');
  // console.log(input.html());
  
 
  for (var i =0; i <articles.length; i++){
    var element = createElement('h2',articles[i].headline.main);
    var p = createP(articles[i].snippet);
    div.child(element);
    div.child(p);
    // for(var j = 0; j<p.length; j++){
      
    // }
  }
} 

function mouseMoved(){
  var year_ = select('#yr');
  year_.html(floor(map(mouseX,0,window.innerWidth,1987,2017)));
  
  //map(mouseX,0,900,1980,2016);
  
}

