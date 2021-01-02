function BattleTimer () {
    this.timeCountDown = 0;
    
    this.events = {
        timeUpdate: new Phaser.Signal(),
        timeOut: new Phaser.Signal()
    };
}
//-----------------------------------------------------------------------------------------------------------
BattleTimer.prototype = {
    start : function () {
        // Get data
        this.timeCountDown = game.data.level.duration;
        
        // Set up loop
        /** @type Phaser.Timer */var timer = game.time.create( false );
        timer.repeat(
            1 * Phaser.Timer.SECOND,
            this.timeCountDown,
            this._onUpdateTimer,
            this
        );
        timer.start();
        
        // Draw first view
        this.timeCountDown++;
        this._onUpdateTimer();
    },
    //-------------------------------------------------------------------------------------------------------
    _onUpdateTimer : function () {
        --this.timeCountDown;
        
//        console.log( 'TIME: ', this.timeCountDown );
        this.events.timeUpdate.dispatch( this.timeCountDown );
        
        if (this.timeCountDown <= 0) {
            this.events.timeOut.dispatch();
        }
    }
};