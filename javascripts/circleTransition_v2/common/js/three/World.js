/*
3D WORLD
*/



World = (function() {
    /*
    CONST
    */
    function World(_op) {
        this._objMng;

        this.isOver = false;
        this.isAction = false;

        this._parent = _op._parent;
        this._id = _op._id;
        this._fronturls = _op._fronturls;
        this._backurls = _op._backurls;
        this._url = _op._url;

        this._stageWidth = document.getElementById(this._id).getBoundingClientRect().width;
        this._stageHeight = document.getElementById(this._id).getBoundingClientRect().height;

        //camera
        this._fov = 50;
        this._far = 2000;
        this._near = 1;

        this.init();
    }


    /*
    INIT
    */
    World.prototype.init = function() {
        //if ( !Detector.webgl ) isWebGL = false;
        isWebGL = false;

        var _this = this;
        this._meshParentList = [];


        this.initEngine();
        this.initRender();


        //RESIZE
        if (isFullScreen) {
            window.onresize = function(e) {
                return _this.onResize(e);
            };

            this.onResize();
        }

        //
        this._objMng = new ObjectMngCV(this);

        //
        this.createModel();



        //
        var _www = this;

        $(String("#" + _www._id)).hover(
            function() {
                document.body.style.cursor = "pointer";
                _www.mOver();
            },
            function() {
                document.body.style.cursor = "default";
                _www.mOut();
            }
        );

        $(String("#" + _www._id)).click(
            function() {
                pageJump(_www._url);
            }
        );


        //
        this._parent.modelComp();
    }



    /*
    OVER
    */
    World.prototype.mOver = function() {
        if (!this.isOver) {
            this.isOver = true;
            this.isAction = true;
        }
    }

    World.prototype.mOut = function() {
        if (this.isOver) {
            this.isOver = false;
        }
    }



    World.prototype.animeEnd = function() {
        this.isAction = false;
    }



    /*
    ENGINE
    */
    World.prototype.initEngine = function() {
        this._container = document.createElement('div');
        document.getElementById(this._id).appendChild(this._container);

        //camera
        this._cam = new THREE.PerspectiveCamera(this._fov, this._stageHeight / this._stageHeight, this._near, this._far);
        this._cam.position.z = 496;

        if (!isWebGL) {
            this._cam.position.z = 1000;
        }

        //scene
        this._scene = new THREE.Scene();
    }


    /*
    INIT RENDER
    */
    World.prototype.initRender = function() {
        this._render = new THREE.CanvasRenderer();
        this._render.setSize(this._stageWidth, this._stageWidth);
        this._container.appendChild(this._render.domElement);
    }




    World.prototype.createModel = function() {
        this._objMng.createPlane();

    }




    World.prototype.addMesh = function(_mesh, _obj) {
        this._scene.add(_mesh);

        if (_obj != null || _obj != undefined) {
            this._meshParentList.push(_obj);
        }

        this._render.render(this._scene, this._cam);
    }

    World.prototype.removeMesh = function(_mesh, _obj) {
        this._scene.remove(_mesh);

        var index = this._meshParentList.indexOf(_obj);
        if (index > -1) {
            this._meshParentList.splice(index, 1);
        }

        this._render.render(this._scene, this._cam);
    }


    /*
    RENDER
    */
    World.prototype.onEnterFrame = function() {
        if (this.isAction) {
            var _leng = this._meshParentList.length;

            for (var i = 0; i < _leng; i++) {
                this._meshParentList[i].onEnterFrame();
            }

            this._render.render(this._scene, this._cam);

            //console.log("EEEEEEE");
        }
    }


    /*
    RESIZE
    */
    World.prototype.onResize = function(e) {
        if (typeof e === "undefined") {
            e = null;
        }

        this._stageWidth = window.innerWidth;
        this._stageHeight = window.innerHeight;

        this._cam.aspect = this._stageWidth / this._stageHeight;
        this._cam.updateProjectionMatrix();
        this._render.setSize(this._stageWidth, this._stageHeight);
    }

    return World;

})();
