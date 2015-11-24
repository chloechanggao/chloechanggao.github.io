var allgifs=[];


function CreateGifController(path,imgid, window_width) {
    function loadComplete() {
        console.log("image loading complete");
        allgifs.push(supergif);
    }
    
    var supergif = new SuperGif({
        gif: $(imgid)[0],
        max_width: window_width/3
    });
    supergif.load_url(path, loadComplete);
}

function CreateEventHub(window_width){
    function handleMouseMove(e){
        var moveX = e.clientX;
        for (i=0;i<allgifs.length;i++) {
            var f = 130 - 130 * moveX / window_width;
            globalsupergif.move_to(f);
            globalsupergif.pause();   
        }
    }
    $(document).mousemove(handleMouseMove);
}



$(document).ready(function(){
    
    $("#r11").attr("src", "gifs/wt3.gif").hide().delay(1352).fadeIn(800);
    $("#r12").attr("src", "gifs/lyy2.gif").hide().delay(1675).fadeIn(2000);
    $("#r13").attr("src", "gifs/333.gif").hide().delay(1900).fadeIn(900);
    $("#r21").attr("src", "gifs/332.gif").hide().delay(1864).fadeIn(3000);
    $("#r22").attr("src", "gifs/wt2.gif").hide().delay(1500).fadeIn(1500);
    $("#r23").attr("src", "gifs/331.gif").hide().delay(400).fadeIn(2200);
    //$("#r31").attr("src", "gifs/lyy1.gif").hide().delay(2000).fadeIn(432);
    $("#r32").attr("src", "gifs/wt4.gif").hide().delay(1000).fadeIn(777);
    $("#r33").attr("src", "gifs/wt1.gif").hide().delay(1600).fadeIn(888);
    
    CreateGifController("gifs/lyy1.gif", "#r31", $(window).width());
    
    CreateEventHub($(window).width());
    
})
