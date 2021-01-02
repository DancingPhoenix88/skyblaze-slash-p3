"use strict";

function RecyclePool (_capacity) {
    this._pool           = [];
    this._capacity       = _capacity;
    this._takeIndex     = 0;
    this._giveIndex     = 0;
}
//-----------------------------------------------------------------------------------------------------------
RecyclePool.prototype = {
    takeOut : function () {
        var obj = this._pool[ this._takeIndex ];
        this._takeIndex = (this._takeIndex + 1) % this._capacity;
        return obj;
    },
    //-------------------------------------------------------------------------------------------------------
    giveBack : function (obj) {
        this._pool[ this._giveIndex ] = obj;
        this._giveIndex = (this._giveIndex + 1) % this._capacity;
    },
    //-------------------------------------------------------------------------------------------------------
    debug : function () {
        console.log( 'Pool stats: ' + this._pool.length + '/' + this._capacity 
            + ' objects. Take @ ' + this._takeIndex + ', Give @ ' + this._giveIndex );
        console.log( 'Pool content: ', this._pool );
    }
};