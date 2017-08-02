/*
VERTICES POINT
*/



PointMngCV = (function() {
    /*
    CONST
    */
    function PointMngCV(_v, _id, _obj, _randomNum) {
        this._obj = _obj;

        this._count = 0;
        this._v = new THREE.Vector3(_v.x, _v.y, _v.z);
        this._trgV = new THREE.Vector3();
        this._currentV = new THREE.Vector3();

        //
        this.isAction = false;

        //
        this._rad = 0;

        this._baseRad = 66; //64;//66;

        //
        this._adRad = 0; //20;
        this._adMax = Math.ceil(Math.random() * 30);
        this._adSpeed = Math.random() * 2 + 1;

        this._adCount = 0;



        //
        this._rad = this._baseRad;

        var index;

        var _degs = [_id * 14, _id * 16.5, _id * 10.9, _id * 19, _id * 10];

        var shapes = [{
                _deg: _degs[0],
                _tx: Math.cos(_degs[0] * Math.PI / 100) * this._rad,
                _ty: Math.sin(_degs[0] * Math.PI / 180) * this._rad,
            },
            {
                _deg: _degs[1],
                _tx: Math.cos(_degs[1] * Math.PI / 10) * this._rad,
                _ty: Math.sin(_degs[1] * Math.PI / 180) * this._rad,
            },
            {
                _deg: _degs[2],
                _tx: Math.cos(_degs[2] * Math.PI / 5) * this._rad,
                _ty: Math.sin(_degs[2] * Math.PI / 50) * this._rad,
            },
            {
                _deg: _degs[3],
                _tx: Math.cos(_degs[3] * Math.PI / 10) * this._rad,
                _ty: Math.sin(_degs[3] * Math.PI / 10) * this._rad,
            },
            {
                _deg: _degs[4],
                _tx: Math.cos(_degs[4] * Math.PI / 45) * this._rad,
                _ty: Math.sin(_degs[4] * Math.PI / 45) * this._rad,
            }
        ];



        var index = Math.floor(_randomNum * shapes.length);
        console.log("choosing shapes" + index);


        this._trgV.x = shapes[index]._tx * 1.15;
        this._trgV.y = shapes[index]._ty * 1.15;
        this._trgV.z = _id * 1.2;


        this._currentV.x = this._v.x;
        this._currentV.y = this._v.y;
        this._currentV.z = this._v.z;

        this._speedA = Math.random() * .08 * 0.01 + 0.1;
        this._speedB = 1 - this._speedA;

        this._speedC = Math.random() * 20 * 0.01 + 0.15;
        this._speedD = 1 - this._speedC;
    }



    PointMngCV.prototype.getPoint = function(isOver) {
        if (isOver) {
            this._currentV.x = (this._currentV.x * this._speedB) + (this._trgV.x * this._speedA);
            this._currentV.y = (this._currentV.y * this._speedB) + (this._trgV.y * this._speedA);
            this._currentV.z = (this._currentV.z * this._speedB) + (this._trgV.z * this._speedA);
        } else {
            this._currentV.x = (this._currentV.x * this._speedD) + (this._v.x * this._speedC);
            this._currentV.y = (this._currentV.y * this._speedD) + (this._v.y * this._speedC);
            this._currentV.z = (this._currentV.z * this._speedD) + (this._v.z * this._speedC);
        }

        return this._currentV;
    }


    return PointMngCV;

})();
