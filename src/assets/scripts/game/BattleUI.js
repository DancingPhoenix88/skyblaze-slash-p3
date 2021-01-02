function BattleUI (battleState) {
    this.state = battleState;
    //                     0, 1,  2,  3,  4,  5,  6,  7,  8
    this.spineByHit = [ 0, 25, 25, 25, 50, 50, 75, 75, 100 ];
    this.init( battleState );
}
//-----------------------------------------------------------------------------------------------------------
BattleUI.prototype = {
    init : function (battleState) {
        this.spine = this.state.fSpine;
        this.redBottom = this.state.fRed_bottom;
        this.powerBar = this.state.fPowerBar;
        this.txtTime = this.state.fTxt_time;
        this.txtPoint = this.state.fTxt_point;
        
        var spineFrames = this.spineByHit.filter( onlyUnique );
        for (var i = 0 ; i < spineFrames.length; ++i) {
            this.spine.animations.add(
                'spine-' + spineFrames[i], 
                ['spine-' + spineFrames[i]], 
                1, 
                false, 
                false 
            );
        }
        
        this.connectWithTimer( battleState.timer );
        this.connectWithPointManager( battleState.pointManager );
        this.connectWithPowerManager( battleState.powerManager );
        this.connectWithHitCount( battleState );
        this.redBottom.alpha = 0;
    },
    //-------------------------------------------------------------------------------------------------------
    connectWithTimer : function (battleTimer) {
        battleTimer.events.timeUpdate.add( this.onUpdateTimer, this );
    },
    //-------------------------------------------------------------------------------------------------------
    connectWithPointManager : function (battlePointManager) {
        this.onUpdatePoint( battlePointManager.getTotalPoint() );
        battlePointManager.events.update.add( this.onUpdatePoint, this );
    },
    //-------------------------------------------------------------------------------------------------------
    connectWithPowerManager : function (battlePowerManager) {
        this.powerBar.set( battlePowerManager.getPoint() );
        battlePowerManager.events.update.add( this.powerBar.set, this.powerBar );
        battlePowerManager.events.activate.add( this.powerBar.onActivate, this.powerBar );
    },
    //-------------------------------------------------------------------------------------------------------
    connectWithHitCount : function (battleState) {
        this.setSpineByHit( battleState.hitCount );
        battleState.events.hit.add( this.onUpdateHit, this );
    },
    //-------------------------------------------------------------------------------------------------------
    onUpdateTimer : function (t) {
        this.txtTime.text = '' + t;
        this.txtTime.fill = (t > 5) ? '#FFFFFF' : '#FF0000'; 
    },
    //-------------------------------------------------------------------------------------------------------
    onUpdatePoint : function (p) {
        this.txtPoint.text = '' + p; 
    },
    //-------------------------------------------------------------------------------------------------------
    setSpineByHit : function (hit) {
        if (hit < 0) hit = 0;
        else if (hit >= this.spineByHit.length) hit = this.spineByHit.length - 1;
        this.spine.animations.play( 'spine-' + this.spineByHit[hit] );
    },
  //-------------------------------------------------------------------------------------------------------
    onUpdateHit : function (hit) {
        this.setSpineByHit( hit );
        
        game.tweens.removeAll( this.redBottom ); // cancel running tweens
        game.add.tween( this.redBottom )
            .to({alpha:1}, 0.3 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out )
            .to({alpha:0}, 0.5 * Phaser.Timer.SECOND )
            .start();
    },
};