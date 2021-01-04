import { GameEvents } from "./GameEvents";
import PointManager from "./PointManager";

class PowerManager {
    constructor (time, events) {
        this.MAX_POINT      = 10;
        this.BOOST_DURATION = 5000;
        this.BOOST_MULTIPLY = 3;

        /** @type Phaser.Time.Clock */this.time = time;
        /** @type Phaser.Events.EventEmitter */this.events = events;
        /** @type Phaser.Time.TimerEvent */this.timerEvent = null;
        this._reset();
        this._isActive = false;
    }
    //------------------------------------------------------------------------------------------------------------------
    _reset () {
        this._isActive = false;
        this._selfDeactivate();
        
        if (this.timerEvent) this.timerEvent.remove( false );
    }
    //------------------------------------------------------------------------------------------------------------------
    clearEvents () {
        this.events.removeAllListeners( GameEvents.UPDATE_POWER );
    }
    //------------------------------------------------------------------------------------------------------------------
    addPoint (point) {
        if (this._isActive) return;
        this.setPoint( this._point + point  );
    }
    //------------------------------------------------------------------------------------------------------------------
    setPoint (point) {
        var oldPoint = this._point;
        this._point = point.clamp(0, this.MAX_POINT);
        if (this._point != oldPoint) this.events.emit( GameEvents.UPDATE_POWER, this._point );
        if (this.activable()) this.activate();
    }
    //------------------------------------------------------------------------------------------------------------------
    activable () {
        return (this._point >= this.MAX_POINT);
    }
    //------------------------------------------------------------------------------------------------------------------
    getMaxPoint () {
        return this.MAX_POINT;
    }
    //------------------------------------------------------------------------------------------------------------------
    activate () {
        if (this.activable() == false) return;
        this._isActive = true;
        PointManager.Singleton().setMultiplier( this.BOOST_MULTIPLY );
        
        // timer to deactivate
        this.timerEvent = this.time.addEvent( {
            delay: this.BOOST_DURATION,
            callback: this.deactivate,
            callbackScope: this
        });
        console.log( "<color=green>POWER BOOST activated (x{0} in {1}s)</color>", this.BOOST_MULTIPLY, this.BOOST_DURATION );

        this.events.emit( GameEvents.ACTIVATE_POWER, this.BOOST_MULTIPLY, this.BOOST_DURATION )
    }
    //------------------------------------------------------------------------------------------------------------------
    deactivate () {
        this._isActive = false;
        this._selfDeactivate();
        console.log( "<color=green>POWER BOOST deactivated</color>" );
    }
    //------------------------------------------------------------------------------------------------------------------
    _selfDeactivate () {
        PointManager.Singleton().setMultiplier( 1 );
        this.setPoint( 0 );
    }
    //------------------------------------------------------------------------------------------------------------------
    getPoint () {
        return this._point;
    }
    //------------------------------------------------------------------------------------------------------------------
    static Singleton (time, events) {
        if (PowerManager._instance == null) {
            PowerManager._instance = new PowerManager(time, events);
        }
        if (time) PowerManager._instance.time = time;
        if (events) PowerManager._instance.events = events;
        return PowerManager._instance;
    }
}

PowerManager._instance = null;

export default PowerManager;