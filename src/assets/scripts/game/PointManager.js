class PointManager {
    constructor (events) {
        /** @type Phaser.Events.EventEmitter */this.events = events;
        this._reset();
    }
    //------------------------------------------------------------------------------------------------------------------
    _reset () {
        this._point = 0;
        this._lastStage = 0;
        this._multiplier = 1;
        this._isLastStageCleared = false;
    }
    //------------------------------------------------------------------------------------------------------------------
    clearEvents () {
        this.events.removeAllListeners( 'update' );
    }
    //------------------------------------------------------------------------------------------------------------------
    addPoint (point) {
        this.setPoint( this._point + point * this._multiplier );
    }
    //------------------------------------------------------------------------------------------------------------------
    setPoint (point) {
        this._point = point;
        this.events.emit( 'update_point', this._point );
    }
    //------------------------------------------------------------------------------------------------------------------
    setMultiplier (multiplier) {
//        console.log( 'setMultiplier = ', multiplier );
        this._multiplier = Math.max( multiplier, 1 );
    }
    //------------------------------------------------------------------------------------------------------------------
    getMultiplier () {
        return this._multiplier;
    }
    //------------------------------------------------------------------------------------------------------------------
    beginStage (stage) {
        this._lastStage = stage;
    }
    //------------------------------------------------------------------------------------------------------------------
    endStage (isWin) {
        this._isLastStageCleared = isWin;
    }
    //------------------------------------------------------------------------------------------------------------------
    getTotalPoint () {
        return this._point;
    }
    //------------------------------------------------------------------------------------------------------------------
    getLastStage () {
        return this._lastStage;
    }
    //------------------------------------------------------------------------------------------------------------------
    isLastStageCleared () {
        return this._isLastStageCleared;
    }

    static Singleton (events) {
        if (PointManager._instance == null) {
            PointManager._instance = new PointManager(events);
        }
        if (events) PointManager._instance.events = events;
        return PointManager._instance;
    }
}

PointManager._instance = null;

export default PointManager;