/*
OBJECTS CANVAS
*/


ObjectMngCV = (function() {
    /*
    CONST
    */
    function ObjectMngCV(_world) {
        this._world = _world;


        //
        this._geoCov;
        this._meshCov;

        //
        this._geo;
        this._mesh;

        //
        this._geoText;
        this._meshText;

        //
        this._geoRay;
        this._meshRay;

        //
        this._segW = 6; //8;
        this._segH = 4;

        this._count = 0;
        this._rz = 0;


        this._vList = [];
    }


    ObjectMngCV.prototype.recreateVlist = function() {

        this._vList = [];
        var randomNum = Math.random();
        for (var i = 0; i < this._geo.vertices.length; i++) {
            var _v = new PointMngCV(this._geo.vertices[i], i, this, randomNum);
            this._vList.push(_v);
        }

    }

    /*
    PLANE TEXTURE LOADED
    */
    ObjectMngCV.prototype.loadCompPlane = function(e) {
        var map = e;
        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        var _op = {
            ambient: 0xFFFFFF,
            color: 0xffffff,
            side: THREE.DoubleSide,
            map: map,
            transparent: true,
            opacity: 1,
            overdraw: 0.5
        };

        //var _material = new THREE.MeshBasicMaterial( _op );
        //var _material = new THREE.MeshLambertMaterial( _op );

        var _material = new THREE.MeshPhongMaterial(_op);


        this._geo = new THREE.PlaneGeometry(this._world._stageWidth, this._world._stageWidth, this._segW, this._segH);
        this._geo.dymanic = true;

        this._mesh = new THREE.Mesh(this._geo, _material);

        //
        this.recreateVlist();

        //
        this._world.addMesh(this._mesh, this);

        //

        this.recreateTextPlane();

        //

        //this.createPlane();

    }



    ObjectMngCV.prototype.createPlane = function() {
      if (this._mesh != null || this._mesh != undefined) {
          this._world.removeMesh(this._mesh, null);
      }
        var _this = this;
        var currentPic = Math.floor(Math.random() * bgPics.length);
        console.log(currentPic);
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load(this._world._fronturls[currentPic], function(e) {
            _this.loadCompPlane(e)
        });
    }


    /*
    TEXT FRAME
    */
    ObjectMngCV.prototype.recreateTextPlane = function() {
        if (this._meshText != null || this._meshText != undefined) {
            this._world.removeMesh(this._meshText, null);
        }

        var currentPic = Math.floor(Math.random() * bgPics.length);
        //console.log(currentPic);
        var map = THREE.ImageUtils.loadTexture(this._world._backurls[currentPic]);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        var _op = {
            color: 0xFFFFFF,
            map: map,
            wireframe: false,
            transparent: true,
            opacity: 0
        };


        var _material = new THREE.MeshBasicMaterial(_op);

        this._geoText = new THREE.PlaneGeometry(this._world._stageWidth, this._world._stageWidth, 1, 1);

        this._meshText = new THREE.Mesh(this._geoText, _material);

        //
        this._world.addMesh(this._meshText, null);

        this._meshText.position.z = -100;
    }


    /*
    ENTER FRAME
    */
    ObjectMngCV.prototype.onEnterFrame = function() {
        if (_device != "PC") {
            return;
        }

        var i;
        var leng = this._geo.vertices.length;


        if (this._world.isOver) {
            this._rz += 0.5;

            if (this._rz >= 360) {
                this._rz = 0;
            }

            this._mesh.rotation.z = this._rz * Math.PI / 180;
            this._mesh.position.z = (this._mesh.position.z * 0.85) + (10 * 0.15);
            this._mesh.material.opacity = (this._mesh.material.opacity * 0.85) + (0.5 * 0.15);


            for (i = 0; i < leng; i++) {
                var _nv = this._vList[i].getPoint(true);
                this._geo.vertices[i].x = _nv.x;
                this._geo.vertices[i].y = _nv.y;
                this._geo.vertices[i].z = _nv.z;
            }


            this._meshText.material.opacity += 0.05;


            if (this._meshText.material.opacity >= 1) {
                this._meshText.material.opacity = 1;
            }


            //this._meshText.position.z = ( this._meshText.position.z * 0.85 ) + ( -10 * 0.15 );
            this._meshText.position.z = (this._meshText.position.z * 0.85) + (0 * 0.15);
        } else {
            this._rz = 0;
            this._mesh.rotation.z = (this._mesh.rotation.z * 0.85) + (0 * 0.15);
            this._mesh.position.z = (this._mesh.position.z * 0.85) + (0 * 0.15);
            this._mesh.material.opacity = (this._mesh.material.opacity * 0.85) + (1 * 0.15);


            for (i = 0; i < leng; i++) {
                var _nv = this._vList[i].getPoint(false);
                this._geo.vertices[i].x = _nv.x;
                this._geo.vertices[i].y = _nv.y;
                this._geo.vertices[i].z = _nv.z;
            }

            this._meshText.material.opacity -= 0.05;

            if (this._meshText.material.opacity <= 0) {
                this._meshText.material.opacity = 0;
            }


            this._meshText.position.z = (this._meshText.position.z * 0.92) + (-100 * 0.08);

            if (Math.abs(this._meshText.position.z - (-100)) < 1) {
                this._world.animeEnd();
                this.recreateVlist();
                this.recreateTextPlane();
                this.createPlane();
            }
        }

        this._geo.verticesNeedUpdate = true;

    }


    return ObjectMngCV;

})();
