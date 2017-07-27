/*
VERTICES POINT
*/



PointMngCV = (function() {
    /*
    CONST
    */
    function PointMngCV(_v, _id, _obj) {
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



        var _deg = _id * 14;
        var _tx = Math.cos(_deg * Math.PI / 100) * this._rad;
        var _ty = Math.sin(_deg * Math.PI / 180) * this._rad;

        this._trgV.x = _tx * 1.3;
        this._trgV.y = _ty * 1.3;
        this._trgV.z = _id * 1.4;

        this._currentV.x = this._v.x;
        this._currentV.y = this._v.y * 2;
        this._currentV.z = this._v.z ;

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
