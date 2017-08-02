/*
common
*/

var _main;

var bgPics = [
  "common/js/share/outernets-logo2.png",
  "common/js/share/bgp1.png",
  "common/js/share/bgp2.png",
  "common/js/share/bgp3.png",
  "common/js/share/bgp4.png"
];




//cycle through
// function nextPic() {
//   currentPic++;
//   if (currentPic >= bgPics.length) {
//      currentPic = 0;
//   }
// };



var Main = (function() {
    function Main() {
        this._threeMain;

        this._worksList = ["mainDiv", bgPics, bgPics, "http://outernets.co/"];


        this._modelCount = 0;


        window.onload = function() {
            _main.onLoad();
        }
    }


    Main.prototype.onLoad = function() {
        //var _ref = document.referrer;
        //console.log( "_ref:" + _ref );

        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        window.scrollTo(0, 0);
        document.getElementById("container").style.visibility = "hidden";
        document.getElementById("container").style.top = "300px";
        document.getElementById("container").style.opacity = "0";

        //tjree.js
        this._threeMain = new THREEMain();

        this._threeMain.create(this._worksList[0], this._worksList[1], this._worksList[2], this._worksList[3]);


        if (navigator.userAgent.indexOf("Mac") == -1) {
            setScrroll();
        }

        setPageTop();

        window.onresize = function(e) {
            onResize();
        }




            document.body.style.overflow = "auto";
            document.body.style.position = "static";
            window.scrollTo(0, 0);



        //LOADING ADD
        this.addLoadind();

        window.onunload = function() {}
    }



    Main.prototype.clearCover = function() {
        this.xAllReady();

        var _this = this;

        $('#cover').animate({
            top: (window.innerHeight * -1 - 100),
        }, 650, 'easieEaseOutCubic', _this.clearCoverComp);

        H3D.index.stop();
    }

    Main.prototype.clearCoverComp = function() {
        //console.log( "ccc:" + _main._cover );
        _main._cover.clearCover();
        var _child = document.getElementById("cover");
        document.body.removeChild(_child);
        _main.xAllStart();

        H3D.index.destroy();
    }



    /*------------------------------------------------------------------------
    START
    */
    Main.prototype.xAllReady = function() {
        document.body.style.overflow = "auto";
        document.body.style.position = "static";
        document.getElementById("container").style.visibility = "visible";


        //
        $('#container').animate({
            top: '120px',
            opacity: 1
        }, 600, 'easieEaseOutCubic');

        window.scrollTo(0, 0);
    }



    Main.prototype.xAllStart = function() {
        this._threeMain.start();
    }



    Main.prototype.modelComp = function() {
        this._modelCount++;

        if (this._modelCount >= 1) {
            this._timer = setTimeout(_main.modelCompTimer, 1000);
        }
    }

    Main.prototype.modelCompTimer = function() {
        clearTimeout(_main._timer);

        if (_main.isCover) {
            //coverあり
            _main._cover.start();
        } else {
            //coverなし
            _main.xAllReady();
            _main.xAllStart();
            //LOADING REMOVE
            _main.removeLoading();
        }
    }



    /*
    LOADING-----------------------------------------------------------------------
    */

    Main.prototype.addLoadind = function() {
        var _elm = document.createElement('div');
        _elm.id = "loading";
        _elm.innerHTML = "<img src='http://homunculus.jp/common/img/loading.gif'>"
        document.body.appendChild(_elm);
    }


    Main.prototype.removeLoading = function() {
        if (document.getElementById("loading") != null); {
            $('#loading').animate({
                opacity: 0
            }, 300, 'easieEaseOutCubic', _main.removeLoadingComp);
        }
    }


    Main.prototype.removeLoadingComp = function() {
        var _child = document.getElementById("loading");
        document.body.removeChild(_child);
    }



    return Main;

})();


_main = new Main();
