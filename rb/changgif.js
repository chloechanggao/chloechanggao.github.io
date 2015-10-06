console.log("hellooooooo");

function width(){ // W
    return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
}

$(document).ready(function (){
    var gifController = new SuperGif(
            {gif: $("#maingif")[0]}
    );

function hookInteraction(){
    
    function handleMouseMove(e){
        var mX = e.pageX;
        var f = 18 - 18 * mX / width();
        gifController.move_to(f);
        gifController.pause();
        
    }
    
    $("html").mousemove(handleMouseMove);
    
    console.log("animation ready!");
}

function go(){
    console.log("Loading controller...");
    
    gifController.load(hookInteraction);
    
}
go();
});
