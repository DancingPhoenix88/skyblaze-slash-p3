function MasterData () {
    this._data = {};
}
//-----------------------------------------------------------------------------------------------------------
MasterData.prototype = {
    load : function (table) {
        if (table in this._data) {
//            console.warn( 'table ', table, ' loaded already -> ignore re-loading' );
            return;
        }
        
        var rawData = game.cache.getJSON( table );
        if (!('id' in rawData[0])) {
            console.error( 'Property "id" not found in table ', table );
            return;
        }
        
        var hashedData = {};
        for (var i = 0; i < rawData.length; ++i) {
            hashedData[ rawData[i]['id'] ] = rawData[i];
        }
        this._data[ table ] = hashedData;
    },
    //-------------------------------------------------------------------------------------------------------
    get : function (table) {
        this.load( table );
        return this._data[ table ];
    },
    //-------------------------------------------------------------------------------------------------------
    getById : function (table, id) {
        this.load( table );
        return this._data[ table ][ id ];
    }
};
//-----------------------------------------------------------------------------------------------------------
MasterData.Singleton = new MasterData();