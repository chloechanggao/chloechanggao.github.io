(function LRB() {
    var Rbln = {
        gifdata: [
            {row: 1, col: 1, path: "../gifs/wt3.gif"},
            {row: 1, col: 2, path: "../gifs/lyy2.gif"},
            {row: 1, col: 3, path: "../gifs/333.gif"},
            {row: 2, col: 1, path: "../gifs/332.gif"},
            {row: 2, col: 2, path: "../gifs/wt2.gif"},
            {row: 2, col: 3, path: "../gifs/331.gif"},
            {row: 3, col: 1, path: "../gifs/lyy1.gif"},
            {row: 3, col: 2, path: "../gifs/wt4.gif"},
            {row: 3, col: 3, path: "../gifs/wt1.gif"}
        ]
    };

    function GetDivId(row, col) {
        return "#r"+row+col;
    }

    function CreateGifController(gif_data, window_w, window_h) {
        var divid = GetDivId(gif_data.row, gif_data.col);
        var simgid = divid+"simg";
        $(divid).append($("<img></img>").attr("id", simgid.substring(1)));
        $(divid).mouseenter(function(){
            $(this).fadeIn("fast");
        }).mouseleave(function(){
            $(this).fadeTo("fast", 0.5);
        });
        var path = gif_data.path;
        var supergif = new SuperGif({
            gif: $(simgid)[0],
            max_width: Math.min(window_w/3, window_h/3*(4/3))
        });

        function loadComplete() {
            console.log("image loading complete for image "+simgid);
            gif_data.controller = supergif;
        }
        supergif.load_url(path, loadComplete);
    }

    function CreateEventHub(window_w, window_h){
        function handleMouseMove(e){
            var moveX = e.clientX;
            var moveY = e.clientY;
            for (i=0;i<Rbln.gifdata.length;i++) {
                var g = Rbln.gifdata[i];
                if (g.controller) {
                    var giflen = g.controller.get_length();
                    var f = 0;
                    if (g.row > g.col) {
                        f = giflen * (1 - moveX / window_w);
                    } else if (g.row < g.col) {
                        f = giflen * (1 - moveY / window_h);
                    } else {
                        f = giflen * (1 - Math.sqrt(moveX * moveY / window_w / window_h));
                    }
                    g.controller.move_to(f);
                    g.controller.pause();
                }
            }
        }
        $(document).mousemove(handleMouseMove);
    }



    $(document).ready(function(){

        wwidth = $(window).width();
        wheight = $(window).height();

        Rbln.gifdata.forEach(function(curr){
            CreateGifController(curr, wwidth, wheight);
        });
        CreateEventHub(wwidth, wheight);

    });
}());
