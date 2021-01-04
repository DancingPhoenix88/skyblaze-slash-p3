class RecyclePool {
    constructor (capacity) {
        this._pool          = [];
        this._capacity      = capacity;
        this._takeIndex     = 0;
        this._giveIndex     = 0;
    }
    //-------------------------------------------------------------------------------------------------------
    takeOut () {
        var obj = this._pool[ this._takeIndex ];
        this._takeIndex = (this._takeIndex + 1) % this._capacity;
        return obj;
    }
    //-------------------------------------------------------------------------------------------------------
    giveBack (obj) {
        this._pool[ this._giveIndex ] = obj;
        this._giveIndex = (this._giveIndex + 1) % this._capacity;
    }
    //-------------------------------------------------------------------------------------------------------
    debug () {
        console.log( 'Pool stats: ' + this._pool.length + '/' + this._capacity 
            + ' objects. Take @ ' + this._takeIndex + ', Give @ ' + this._giveIndex );
        console.log( 'Pool content: ', this._pool );
    }
}

export default RecyclePool;