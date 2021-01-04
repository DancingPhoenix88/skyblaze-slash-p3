import { GameEvents } from "./GameEvents";

class BattleTimer {
    constructor (time, events) {
        /** @type Phaser.Time.Clock */this.time = time;
        /** @type Phaser.Events.EventEmitter */this.events = events;
        this.timeCountDown = 0;
    }
    //-------------------------------------------------------------------------------------------------------
    start () {
        // Get data
        this.timeCountDown = game.registry.get('level').duration;
        
        // Set up loop
        this.time.addEvent({
            delay        : 1000,
            callback     : this._onUpdateTimer,
            callbackScope: this,
            repeat       : this.timeCountDown
        });
        
        // Draw first view
        this.timeCountDown++;
        this._onUpdateTimer();
    }
    //-------------------------------------------------------------------------------------------------------
    _onUpdateTimer () {
        --this.timeCountDown;
        
    //    console.log( 'TIME: ', this.timeCountDown );
        this.events.emit( GameEvents.UPDATE_TIME, this.timeCountDown );
        
        if (this.timeCountDown <= 0) {
            this.events.emit( GameEvents.TIME_OUT );
        }
    }
}

export default BattleTimer;