function PowerManager () {
    this.MAX_POINT      = 10;
    this.BOOST_DURATION = 5 * Phaser.Timer.SECOND;
    this.BOOST_MULTIPLY = 3;
    
    this.events = {
        update: new Phaser.Signal(),
        activate: new Phaser.Signal()
    };
    this._reset();
    this._isActive = false;
}
//------------------------------------------------------------------------------------------------------------------
PowerManager.prototype = {
    _reset : function () {
        this._isActive = false;
        this._selfDeactivate();
        
        if (this.timer && this.timer.running) this.timer.stop();
    },
    //------------------------------------------------------------------------------------------------------------------
    clearEvents : function () {
        this.events.update.removeAll();
    },
    //------------------------------------------------------------------------------------------------------------------
    addPoint : function (point) {
        if (this._isActive) return;
        this.setPoint( this._point + point  );
    },
    //------------------------------------------------------------------------------------------------------------------
    setPoint : function (point) {
        var oldPoint = this._point;
        this._point = point.clamp(0, this.MAX_POINT);
        if (this._point != oldPoint) this.events.update.dispatch( this._point );
        if (this.activable()) this.activate();
    },
    //------------------------------------------------------------------------------------------------------------------
    activable : function () {
        return (this._point >= this.MAX_POINT);
    },
    //------------------------------------------------------------------------------------------------------------------
    getMaxPoint : function () {
        return this.MAX_POINT;
    },
    //------------------------------------------------------------------------------------------------------------------
    activate : function () {
        if (this.activable() == false) return;
        this._isActive = true;
        PointManager.Singleton.setMultiplier( this.BOOST_MULTIPLY );
        
        // timer to deactivate
        this.timer = game.time.events.add( this.BOOST_DURATION, this.deactivate, this );
        console.log( "<color=green>POWER BOOST activated (x{0} in {1}s)</color>", this.BOOST_MULTIPLY, this.BOOST_DURATION );

        this.events.activate.dispatch( this.BOOST_MULTIPLY, this.BOOST_DURATION );
    },
    //------------------------------------------------------------------------------------------------------------------
    deactivate : function () {
        this._isActive = false;
        this._selfDeactivate();
        console.log( "<color=green>POWER BOOST deactivated</color>" );
    },
    //------------------------------------------------------------------------------------------------------------------
    _selfDeactivate : function () {
        PointManager.Singleton.setMultiplier( 1 );
        this.setPoint( 0 );
    },
  //------------------------------------------------------------------------------------------------------------------
    getPoint : function () {
        return this._point;
    }
}
//----------------------------------------------------------------------------------------------------------------------
PowerManager.Singleton = new PowerManager();