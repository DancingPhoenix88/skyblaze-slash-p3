function PointManager () {
    this._reset();
    this.events = {
        update: new Phaser.Signal()
    };
}
//------------------------------------------------------------------------------------------------------------------
PointManager.prototype = {
    _reset () {
        this._point = 0;
        this._lastStage = 0;
        this._multiplier = 1;
        this._isLastStageCleared = false;
    },
    //------------------------------------------------------------------------------------------------------------------
    clearEvents : function () {
        this.events.update.removeAll();
    },
    //------------------------------------------------------------------------------------------------------------------
    addPoint : function (point) {
        this.setPoint( this._point + point * this._multiplier );
    },
    //------------------------------------------------------------------------------------------------------------------
    setPoint : function (point) {
        this._point = point;
        this.events.update.dispatch( this._point );
    },
    //------------------------------------------------------------------------------------------------------------------
    setMultiplier : function (multiplier) {
//        console.log( 'setMultiplier = ', multiplier );
        this._multiplier = Math.max( multiplier, 1 );
    },
    //------------------------------------------------------------------------------------------------------------------
    getMultiplier : function () {
        return this._multiplier;
    },
    //------------------------------------------------------------------------------------------------------------------
    beginStage : function (stage) {
        this._lastStage = stage;
    },
    //------------------------------------------------------------------------------------------------------------------
    endStage : function (isWin) {
        this._isLastStageCleared = isWin;
    },
    //------------------------------------------------------------------------------------------------------------------
    getTotalPoint : function () {
        return this._point;
    },
    //------------------------------------------------------------------------------------------------------------------
    getLastStage : function () {
        return this._lastStage;
    },
    //------------------------------------------------------------------------------------------------------------------
    isLastStageCleared : function () {
        return this._isLastStageCleared;
    }
};
//----------------------------------------------------------------------------------------------------------------------
PointManager.Singleton = new PointManager();